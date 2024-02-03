import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { Facturas, GeneralData, Usuarios } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { SendEmailsService } from 'src/modules/send-emails/send-emails.service';
import { convertirCantidadADolaresYCentavos, verifyEmail } from 'src/common/helpers';

@Injectable()
export class ElectronicaService {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private serviceEmail: SendEmailsService,
  ) { }
  async anularFacturaElectronica(factura: Facturas, user: any, tipoAnulacion: number, motivoAnulacion: string) {
    const dataSistem = await this.prisma.generalData.findFirst();
    var sucursal = await this.prisma.sucursales.findFirst({ where: { id_sucursal: user.id_sucursal }, include: { DTETipoEstablecimiento: true } });
    let fecha = new Date();
    let fechaFormateada = format(fecha, 'yyyy-MM-dd HH:mm:ss');
    let uuid = uuidv5(factura.numero_factura, uuidv4());
    let uuid2 = uuidv5(factura.numero_factura, uuidv4());
    var jsonDte = JSON.parse(factura.dte_json);
    var jsonDteResponse = JSON.parse(factura.response_dte_json);
    var data = {
      "identificacion": {
        "version": 2,
        "ambiente": dataSistem.ambiente,
        "codigoGeneracion": uuid.toUpperCase(),
        "fecAnula": fechaFormateada.toString().split(' ')[0],
        "horAnula": fechaFormateada.toString().split(' ')[1],
      },
      "emisor": {
        "nit": dataSistem.nit,
        "nombre": dataSistem.nombre_sistema,
        "tipoEstablecimiento": sucursal.DTETipoEstablecimiento.codigo,
        "nomEstablecimiento": sucursal.nombre,
        "codEstableMH": dataSistem.cod_estable_MH != null && dataSistem.cod_estable_MH.length > 0 ? dataSistem.cod_estable_MH : null,
        "codEstable": dataSistem.cod_estable != null && dataSistem.cod_estable.length > 0 ? dataSistem.cod_estable : null,
        "codPuntoVentaMH": dataSistem.cod_punto_venta_MH != null && dataSistem.cod_punto_venta_MH.length > 0 ? dataSistem.cod_punto_venta_MH : null,
        "codPuntoVenta": dataSistem.cod_punto_venta != null && dataSistem.cod_punto_venta.length > 0 ? dataSistem.cod_punto_venta : null,
        "telefono": dataSistem.contactos,
        "correo": dataSistem.correo,
      },
      "documento": {
        "tipoDte": jsonDte.identificacion.tipoDte,
        "codigoGeneracion": jsonDte.identificacion.codigoGeneracion,
        "selloRecibido": jsonDteResponse.selloRecibido,
        "numeroControl": jsonDte.identificacion.numeroControl,
        "fecEmi": jsonDte.identificacion.fecEmi,
        "montoIva": jsonDte.resumen.totalIva,
        "codigoGeneracionR": uuid2.toUpperCase(),
        "tipoDocumento": jsonDte.receptor.tipoDocumento,
        "numDocumento": jsonDte.receptor.numDocumento,
        "nombre": jsonDte.receptor.nombre,
        "telefono": jsonDte.receptor.telefono,
        "correo": jsonDte.receptor.correo
      },
      "motivo": {
        "tipoAnulacion": tipoAnulacion,
        "motivoAnulacion": motivoAnulacion,
        "nombreResponsable": user.nombres + ' ' + user.apellidos,
        "tipDocResponsable": user.DTETipoDocumentoIdentificacion != null ? user.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocResponsable": user.dui,
        "nombreSolicita": user.nombres + ' ' + user.apellidos,
        "tipDocSolicita": user.DTETipoDocumentoIdentificacion != null ? user.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocSolicita": user.dui
      }
    }

    await this.prisma.facturas.update({
      where: { id_factura: factura.id_factura },
      data: {
        anulado_dte_json: JSON.stringify(data)
      }
    });
    let token = await this.firmarDocumento(data, dataSistem);

    let data_ = {
      "ambiente": dataSistem.ambiente,
      "idEnvio": 1,
      "version": 2,
      "documento": token
    }
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/anulardte`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data: data_, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      if (respuesta.status == 200) {
        await this.prisma.facturas.update({
          where: { id_factura: factura.id_factura },
          data: {
            anulado_response_dte_json: JSON.stringify(respuesta.data)
          }
        });
      }
      return null;
    } catch (error) {
      console.log(error.response); // Mensaje de error
      let msjError = '';
      if (
        error.response.data.observaciones != null &&
        Array.isArray(error.response.data.observaciones)
      ) {
        for (
          let index = 0;
          index < error.response.data.observaciones.length;
          index++
        ) {
          const element = error.response.data.observaciones[index];
          msjError += element + '<br>&nbsp;<br>';
        }
        if (error.response.data.descripcionMsg != 'RECIBIDO') {
          msjError += error.response.data.descripcionMsg + '<br>&nbsp;<br>';
        }
      }
      return msjError;
    }
  }

  async generateDTEFC(factura: any) {
    const dataSistem = await this.prisma.generalData.findFirst();
    let fecha = factura.fecha_creacion || new Date();
    let fechaFormateada = format(fecha, 'yyyy-MM-dd HH:mm:ss');
    let uuid = uuidv5(factura.numero_factura, uuidv4());
    let numeroControl = factura.Bloque.serie + factura.numero_factura;
    let detalle: any[] = [];
    for (let index = 0; index < factura.FacturasDetalle.length; index++) {
      const element: any = factura.FacturasDetalle[index];
      detalle.push({
        "numItem": index + 1,
        "tipoItem": 2,
        "numeroDocumento": null,
        "cantidad": element.cantidad,
        "codigo": null,
        "codTributo": null,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_con_iva,
        "montoDescu": 0,
        "ventaNoSuj": 0,
        "ventaExenta": 0,
        "ventaGravada": element.subtotal,
        "tributos": null,
        "psv": 0,
        "noGravado": 0,
        "ivaItem": element.iva

      });
    }
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": 1,
        "tipoOperacion": 1,
        "tipoContingencia": null,
        "motivoContin": null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "documentoRelacionado": null,
      "otrosDocumentos": null,
      "emisor": {
        "nit": dataSistem.nit,
        "nrc": dataSistem.nrc,
        "nombre": dataSistem.nombre_sistema,
        "codActividad": dataSistem.cod_actividad,
        "descActividad": dataSistem.desc_actividad,
        "nombreComercial": dataSistem.nombre_comercial,
        "tipoEstablecimiento": factura.Sucursal.DTETipoEstablecimiento != null ? factura.Sucursal.DTETipoEstablecimiento.codigo : null,
        "direccion": {
          "departamento": factura.Sucursal.Municipio.Departamento.codigo,
          "municipio": factura.Sucursal.Municipio.codigo,
          "complemento": factura.Sucursal.complemento
        },
        "telefono": dataSistem.contactos,
        "codPuntoVentaMH": null,
        "codPuntoVenta": null,
        "codEstableMH": null,
        "codEstable": null,
        "correo": dataSistem.correo
      },
      "receptor": {
        "tipoDocumento": factura.Cliente.DTETipoDocumentoIdentificacion != null ? factura.Cliente.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocumento": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? factura.Cliente.dui : null,
        "nrc": factura.Cliente.registro_nrc != null && factura.Cliente.registro_nrc != "" && factura.Cliente.registro_nrc != "N/A" ? factura.Cliente.registro_nrc : null,
        "nombre": factura.Cliente.nombre,
        "codActividad": factura.Cliente.DTEActividadEconomica != null ? factura.Cliente.DTEActividadEconomica.codigo : null,
        "descActividad": factura.Cliente.DTEActividadEconomica != null ? factura.Cliente.DTEActividadEconomica.nombre : null,
        "direccion": (factura.Cliente.Municipio == null || factura.Cliente.id_municipio == null) ? null
          : {
            "departamento": factura.Cliente.Municipio != null ? factura.Cliente.Municipio.Departamento.codigo : null,
            "municipio": factura.Cliente.Municipio != null ? factura.Cliente.Municipio.codigo : null,
            "complemento": factura.Cliente.direccion ?? null
          },
        "telefono": (factura.Cliente.telefono != null && factura.Cliente.telefono).length > 0 ? factura.Cliente.telefono : null,
        "correo": (factura.Cliente.correo != null && factura.Cliente.correo.length > 0) ? factura.Cliente.correo : null
      },
      "ventaTercero": null,
      "cuerpoDocumento": [
        ...detalle
      ],
      "resumen": {
        "totalNoSuj": 0,
        "totalExenta": 0,
        "totalGravada": factura.total,
        "subTotalVentas": factura.total,
        "descuNoSuj": 0,
        "descuExenta": 0,
        "descuGravada": 0,
        "porcentajeDescuento": 0,
        "totalDescu": 0,
        "tributos": null,
        "subTotal": factura.total,
        "ivaRete1": 0,
        "reteRenta": 0,
        "montoTotalOperacion": factura.total,
        "totalNoGravado": 0,
        "totalPagar": factura.total,
        "totalLetras": convertirCantidadADolaresYCentavos(factura.total.toString()),
        "totalIva": factura.iva,
        "saldoFavor": 0,
        "condicionOperacion": 1,
        "pagos": null,
        "numPagoElectronico": null
      },
      "extension": {
        "nombEntrega": null,
        "docuEntrega": null,
        "nombRecibe": null,
        "docuRecibe": null,
        "observaciones": `TOTAL TRANSACCION ES POR $ ${factura.total}`,
        "placaVehiculo": null
      },
      "apendice": null
    }
    await this.prisma.facturas.update({
      where: { id_factura: factura.id_factura },
      data: {
        dte_json: JSON.stringify(data)
      }
    });
    return await this.firmarDocumento(data, dataSistem);
  }

  async firmarDocumento(data, dataSistem) {
    let datos = {
      "nit": dataSistem.nit,
      "activo": true,
      "passwordPri": dataSistem.private_key,
      "dteJson": data
    }
    let path_ = `${this.configService.get('API_FIRMA')}firmardocumento/`;
    const config: AxiosRequestConfig = {
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
      },
      data: datos, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      return respuesta.data.body;
    } catch (error) {
      console.log(error.response)
      return null;
    }
  }


  async generarFacturaElectronica(factura: any) {

    let token = '';
    if (factura.Bloque.Tipo.codigo == "01") {
      token = await this.generateDTEFC(factura);
    } else if (factura.Bloque.Tipo.codigo == "03") {
      token = await this.generateDTECCF(factura);
    }
    return await this.envairFactura(factura, token);
  }
  async obtenerNuevoToken(generalData: GeneralData) {
    let path_ = `${this.configService.get('API_FACTURACION')}seguridad/auth`;
    const config: AxiosRequestConfig = {
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        "user": generalData.nit,
        "pwd": generalData.public_key,
      }, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      if (respuesta.status == 200) {
        let token_api_fac = respuesta.data.body.token.replace("Bearer ", "");
        await this.prisma.generalData.update({
          where: { id_general: generalData.id_general },
          data: {
            token_api_fac
          }
        })
        return token_api_fac;
      }
      return null;
    } catch (error) {
      console.log(error) // Mensaje de error
      return null;
    }
  }
  async validarToken() {
    var data = await this.prisma.generalData.findFirst();
    if (data.token_api_fac == null || data.token_api_fac.length == 0) {
      return await this.obtenerNuevoToken(data);
    }
    const payload: any = jwt.decode(data.token_api_fac);
    if (!payload || !payload.exp) {
      return await this.obtenerNuevoToken(data);
    }
    const ahora = Math.floor(Date.now() / 1000); // Tiempo actual en segundos desde epoch
    const tiempoDeVidaRestante = payload.exp - ahora; // Tiempo de vida restante en segundos 
    if (tiempoDeVidaRestante < 100 || tiempoDeVidaRestante == null) {
      return await this.obtenerNuevoToken(data);
    }
    return data.token_api_fac;
  }

  async envairFactura(factura: any, token: string) {
    const dataSistem = await this.prisma.generalData.findFirst();
    var data = {
      "ambiente": dataSistem.ambiente,
      "idEnvio": 1,
      "version": factura.Bloque.Tipo.version,
      "tipoDte": factura.Bloque.Tipo.codigo,
      "codigoGeneracion": "2",
      "documento": token
    }
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/recepciondte`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      const respuesta: AxiosResponse = await axios.request(config);
      if (respuesta.status == 200) {
        await this.prisma.facturas.update({
          where: { id_factura: factura.id_factura },
          data: {
            response_dte_json: JSON.stringify(respuesta.data),
            dte_procesado: true,
          }
        });
        const factura_s = await this.prisma.facturas.findFirst({ where: { id_factura: factura.id_factura }, include: { Cliente: true } });
        var jsonDte = JSON.parse(factura_s.dte_json);
        jsonDte.firmaElectronica = token;
        jsonDte.selloRecibido = respuesta.data.selloRecibido;
        if (verifyEmail(factura_s.Cliente.correo ?? "") && factura_s.Cliente.correo.length > 0) {
          this.serviceEmail.sendEmailInvoice(factura_s.Cliente.correo, JSON.stringify(jsonDte), dataSistem.correo, jsonDte.identificacion.numeroControl + '.json');
        }

      }
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      return null;
    } catch (error) {
      let msjError = '';
      console.log(error.response.data) // Mensaje de error
      console.log(error.response.data.observaciones) // Mensaje de error
      if (error.response.data.observaciones != null && Array.isArray(error.response.data.observaciones)) {
        for (let index = 0; index < error.response.data.observaciones.length; index++) {
          const element = error.response.data.observaciones[index];
          msjError += element + '<br>&nbsp;<br>';
        }
        if (error.response.data.descripcionMsg != "RECIBIDO") {
          msjError += error.response.data.descripcionMsg + '<br>&nbsp;<br>';
        }
        await this.prisma.facturas.update({
          where: { id_factura: factura.id_factura },
          data: {
            dte_errores: msjError
          }
        });
      }
      return msjError;
    }
  }


  async generateDTECCF(factura: any) {
    const dataSistem = await this.prisma.generalData.findFirst();
    let fecha = factura.fecha_creacion || new Date();
    let fechaFormateada = format(fecha, 'yyyy-MM-dd HH:mm:ss');
    let uuid = uuidv5(factura.numero_factura, uuidv4());
    let numeroControl = factura.Bloque.serie + factura.numero_factura;
    let detalle: any[] = [];
    for (let index = 0; index < factura.FacturasDetalle.length; index++) {
      const element: any = factura.FacturasDetalle[index];
      detalle.push({
        "numItem": index + 1,
        "tipoItem": 2,
        "numeroDocumento": null,
        "cantidad": element.cantidad,
        "codigo": null,
        "codTributo": null,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_con_iva,
        "montoDescu": 0,
        "ventaNoSuj": 0,
        "ventaExenta": 0,
        "ventaGravada": element.total + element.iva,
        "tributos": null,
        "psv": 0,
        "noGravado": 0,
        // "ivaItem": element.iva  
      });
    }
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": 1,
        "tipoOperacion": 1,
        "tipoContingencia": null,
        "motivoContin": null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "documentoRelacionado": null,
      "otrosDocumentos": null,
      "emisor": {
        "nit": dataSistem.nit,
        "nrc": dataSistem.nrc,
        "nombre": dataSistem.nombre_sistema,
        "codActividad": dataSistem.cod_actividad,
        "descActividad": dataSistem.desc_actividad,
        "nombreComercial": dataSistem.nombre_comercial,
        "tipoEstablecimiento": factura.Sucursal.DTETipoEstablecimiento != null ? factura.Sucursal.DTETipoEstablecimiento.codigo : null,
        "direccion": {
          "departamento": factura.Sucursal.Municipio.Departamento.codigo,
          "municipio": factura.Sucursal.Municipio.codigo,
          "complemento": factura.Sucursal.complemento
        },
        "telefono": dataSistem.contactos,
        "codPuntoVentaMH": dataSistem.cod_punto_venta_MH != null && dataSistem.cod_punto_venta_MH.length > 0 ? dataSistem.cod_punto_venta_MH : null,
        "codPuntoVenta": dataSistem.cod_punto_venta != null && dataSistem.cod_punto_venta.length > 0 ? dataSistem.cod_punto_venta : null,
        "codEstableMH": dataSistem.cod_estable_MH != null && dataSistem.cod_estable_MH.length > 0 ? dataSistem.cod_estable_MH : null,
        "codEstable": dataSistem.cod_estable != null && dataSistem.cod_estable.length > 0 ? dataSistem.cod_estable : null,
        "correo": dataSistem.correo
      },
      "receptor": {
        "nombreComercial": factura.Cliente.razon_social != null ? factura.Cliente.razon_social : null,
        "nit": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? factura.Cliente.dui : null,
        "nrc": factura.Cliente.registro_nrc != null && factura.Cliente.registro_nrc != "" && factura.Cliente.registro_nrc != "N/A" ? factura.Cliente.registro_nrc : null,
        "nombre": factura.Cliente.nombre,
        "codActividad": factura.Cliente.DTEActividadEconomica != null ? factura.Cliente.DTEActividadEconomica.codigo : null,
        "descActividad": factura.Cliente.DTEActividadEconomica != null ? factura.Cliente.DTEActividadEconomica.nombre : null,
        "direccion": (factura.Cliente.Municipio == null || factura.Cliente.id_municipio == null) ? null
          : {
            "departamento": factura.Cliente.Municipio != null ? factura.Cliente.Municipio.Departamento.codigo : null,
            "municipio": factura.Cliente.Municipio != null ? factura.Cliente.Municipio.codigo : null,
            "complemento": factura.Cliente.direccion ?? null
          },
        "telefono": (factura.Cliente.telefono != null && factura.Cliente.telefono).length > 0 ? factura.Cliente.telefono : null,
        "correo": (factura.Cliente.correo != null && factura.Cliente.correo.length > 0) ? factura.Cliente.correo : null
      },
      "ventaTercero": null,
      "cuerpoDocumento": [
        ...detalle
      ],
      "resumen": {
        "totalNoSuj": 0,
        "totalExenta": 0,
        "totalGravada": factura.total,
        "subTotalVentas": factura.total,
        "descuNoSuj": 0,
        "descuExenta": 0,
        "descuGravada": 0,
        "porcentajeDescuento": 0,
        "totalDescu": 0,
        "tributos": null,
        "subTotal": factura.total,
        "ivaPerci1": 0,
        "ivaRete1": 0,
        "reteRenta": 0,
        "montoTotalOperacion": factura.total,
        "totalNoGravado": 0,
        "totalPagar": factura.total,
        "totalLetras": convertirCantidadADolaresYCentavos(factura.total.toString()),
        "saldoFavor": 0,
        "condicionOperacion": 1,
        "pagos": null,
        "numPagoElectronico": null
      },
      "extension": {
        "nombEntrega": null,
        "docuEntrega": null,
        "nombRecibe": null,
        "docuRecibe": null,
        "observaciones": `TOTAL TRANSACCION ES POR $ ${factura.total}`,
        "placaVehiculo": null
      },
      "apendice": null
    }
    await this.prisma.facturas.update({
      where: { id_factura: factura.id_factura },
      data: {
        dte_json: JSON.stringify(data)
      }
    });
    return await this.firmarDocumento(data, dataSistem);
  }


}
