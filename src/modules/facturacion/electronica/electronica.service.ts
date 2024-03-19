import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { Facturas, GeneralData, Usuarios } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { SendEmailsService } from 'src/modules/send-emails/send-emails.service';
import { NumeroALetras, eliminarGuionesYEspacios, verifyEmail } from 'src/common/helpers';
import { TIMEOUTAXIOS } from 'src/common/const/directory';
import e from 'express';

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
    // let uuid2 = uuidv5(factura.numero_factura, uuidv4());
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
        "codigoGeneracionR": null,
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
    if (jsonDte.identificacion.tipoDte == "03") {
      data.documento.montoIva = jsonDte.resumen.tributos[0].valor;
      data.documento.tipoDocumento = "36";
      data.documento.numDocumento = jsonDte.receptor.nit;
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
    console.log(data_)
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/anulardte`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data: data_, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      console.log(path_)
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
      return "";
    } catch (error) {
      console.log(error.response); // Mensaje de error
      if (error.response == undefined) {
        return "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      }
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

  async debitFacturaElectronica(factura: Facturas, user: any,) {
    const dataSistem = await this.prisma.generalData.findFirst();
    let fecha = new Date();
    let fechaFormateada = format(fecha, 'yyyy-MM-dd HH:mm:ss');
    let uuid = uuidv5(factura.numero_factura, uuidv4());
    var jsonDte = JSON.parse(factura.dte_json);
    const responseDteJson = JSON.parse(factura.response_dte_json);
    const bloque = await this.prisma.facturasBloques.findFirst({
      where: {
        estado: 'ACTIVO',
        Tipo: {
          codigo: '05'
        }
      },
      include: {
        Tipo: true
      }
    });
    console.log("bloque===========");
    const cuerpoDocumento = jsonDte.cuerpoDocumento.map((e) => {
      e.numeroDocumento = responseDteJson.codigoGeneracion;
      delete e.noGravado;
      delete e.psv;
      return e;
    })
    const numero_factura = bloque?.actual.toString().padStart(10, '0');
    const numeroControl = bloque.serie + numero_factura; 
    const contingencia = await this.prisma.contingenciasDetalle.findFirst({ where: { id_factura: factura.id_factura }, include: { Contingencias: true } });
    var data = {
      "identificacion": {
        "version": bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": contingencia != null ? 2 : 1,
        "tipoOperacion": contingencia != null ? 2 : 1,
        "tipoContingencia": contingencia != null ? contingencia.Contingencias.tipo : null,
        "motivoContin": contingencia != null ? contingencia.Contingencias.motivo : null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "documentoRelacionado": [
        {
          "tipoDocumento": jsonDte.identificacion.tipoDte,
          "tipoGeneracion": 2,
          "numeroDocumento": responseDteJson.codigoGeneracion,
          "fechaEmision": jsonDte.identificacion.fecEmi
        }
      ],
      "emisor": {
        "nit": jsonDte.emisor.nit,
        "nrc": jsonDte.emisor.nrc,
        "nombre": jsonDte.emisor.nombre,
        "codActividad": jsonDte.emisor.codActividad,
        "descActividad": jsonDte.emisor.descActividad,
        "nombreComercial": jsonDte.emisor.nombreComercial,
        "tipoEstablecimiento": jsonDte.emisor.tipoEstablecimiento,
        "direccion": {
          "departamento": jsonDte.emisor.direccion.departamento,
          "municipio": jsonDte.emisor.direccion.municipio,
          "complemento": jsonDte.emisor.direccion.complemento,
        },
        "telefono": jsonDte.emisor.telefono,
        "correo": jsonDte.emisor.correo,
      },
      "receptor": {
        "nit": jsonDte.receptor.nit,
        "nrc": jsonDte.receptor.nrc,
        "nombre": jsonDte.receptor.nombre,
        "codActividad": jsonDte.receptor.codActividad,
        "descActividad": jsonDte.receptor.descActividad,
        "nombreComercial": jsonDte.receptor.nombreComercial,
        "direccion": {
          "departamento": jsonDte.receptor.direccion.departamento,
          "municipio": jsonDte.receptor.direccion.municipio,
          "complemento": jsonDte.receptor.direccion.complemento,
        },
        "telefono": jsonDte.receptor.telefono,
        "correo": jsonDte.receptor.correo,
      },
      "ventaTercero": null,
      "cuerpoDocumento": [
        ...cuerpoDocumento,
      ],
      "resumen": {
        "totalNoSuj": jsonDte.resumen.totalNoSuj ?? 0,
        "totalExenta": jsonDte.resumen.totalExenta ?? 0,
        "totalGravada": jsonDte.resumen.totalGravada ?? 0,
        "subTotalVentas": jsonDte.resumen.subTotalVentas ?? 0,
        "descuNoSuj": jsonDte.resumen.descuNoSuj ?? 0,
        "descuExenta": jsonDte.resumen.descuExenta ?? 0,
        "descuGravada": jsonDte.resumen.descuGravada ?? 0,
        "totalDescu": jsonDte.resumen.totalDescu ?? 0,
        "tributos": jsonDte.resumen.tributos ?? 0,
        "subTotal": jsonDte.resumen.subTotal ?? 0,
        "ivaPerci1": jsonDte.resumen.ivaPerci1 ?? 0,
        "ivaRete1": jsonDte.resumen.ivaRete1 ?? 0,
        "reteRenta": jsonDte.resumen.reteRenta ?? 0,
        "montoTotalOperacion": jsonDte.resumen.montoTotalOperacion ?? 0,
        "totalLetras": jsonDte.resumen.totalLetras ?? 0,
        "condicionOperacion": jsonDte.resumen.condicionOperacion ?? 0,
      },
      "extension": null,
      "apendice": null
    }

    let token = await this.firmarDocumento(data, dataSistem);
    const respAPi = await this.enviarDebito(bloque, token);
    if (respAPi != null && respAPi.descripcionMsg != null && respAPi.descripcionMsg == 'RECIBIDO') {
      await this.prisma.facturasBloques.update({
        data: { actual: bloque!.actual + 1 },
        where: { id_bloque: bloque.id_bloque },
      });
      await this.prisma.facturas.update({
        where: { id_factura: factura.id_factura },
        data: {
          notadebito_dte_json: JSON.stringify(data),
          notadebito_resp_dte_json: JSON.stringify(respAPi),
          notadebito_fecha: new Date()
        }
      });
    }
    return respAPi;
  }

  async enviarDebito(bloque, token) {
    const dataSistem = await this.prisma.generalData.findFirst();
    var data = {
      "ambiente": dataSistem.ambiente,
      "idEnvio": 1,
      "version": bloque.Tipo.version,
      "tipoDte": bloque.Tipo.codigo,
      "codigoGeneracion": "2",
      "documento": token
    }
    console.timeStamp()
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/recepciondte`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
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
      if (respuesta.data.descripcionMsg != null && respuesta.data.descripcionMsg == "RECIBIDO") {
        return respuesta.data
      } else {
        return respuesta.data.observaciones.toString();
      }
    } catch (error) {
      let msjError = '';
      if (error.response == undefined) {
        msjError += "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      } else {
        if (error.response.data.observaciones != null && Array.isArray(error.response.data.observaciones)) {
          for (let index = 0; index < error.response.data.observaciones.length; index++) {
            const element = error.response.data.observaciones[index];
            msjError += element + '<br>&nbsp;<br>';
          }
          if (error.response.data.descripcionMsg != "RECIBIDO") {
            msjError += error.response.data.descripcionMsg + '<br>&nbsp;<br>';
          }
        }
      }
      return msjError;
    } finally {
      console.timeEnd()
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
        "codigo": element.codigo,
        "codTributo": null,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_unitario,
        "montoDescu": element.descuento,
        "ventaNoSuj": element.venta_nosujeto,
        "ventaExenta": element.venta_exenta,
        "ventaGravada": element.venta_grabada,
        "tributos": null,
        "psv": 0,
        "noGravado": 0,
        "ivaItem": element.iva ?? 0
      });
    }

    const contingencia = await this.prisma.contingenciasDetalle.findFirst({ where: { id_factura: factura.id_factura }, include: { Contingencias: true } });
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": contingencia != null ? 2 : 1,
        "tipoOperacion": contingencia != null ? 2 : 1,
        "tipoContingencia": contingencia != null ? contingencia.Contingencias.tipo : null,
        "motivoContin": contingencia != null ? contingencia.Contingencias.motivo : null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "documentoRelacionado": null,
      "otrosDocumentos": null,
      "emisor": {
        "nit": eliminarGuionesYEspacios(dataSistem.nit),
        "nrc": eliminarGuionesYEspacios(dataSistem.nrc),
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
        "tipoDocumento": factura.Cliente.DTETipoDocumentoIdentificacion != null ? factura.Cliente.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocumento": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? eliminarGuionesYEspacios(factura.Cliente.dui) : null,
        "nrc": factura.Cliente.registro_nrc != null && factura.Cliente.registro_nrc != "" && factura.Cliente.registro_nrc != "N/A" ? eliminarGuionesYEspacios(factura.Cliente.registro_nrc) : null,
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
        "totalNoSuj": factura.totalNoSuj,
        "totalExenta": factura.totalExenta,
        "totalGravada": factura.totalGravada,
        "totalNoGravado": 0,
        "subTotalVentas": factura.subtotal,
        "descuNoSuj": factura.descuNoSuj,
        "descuExenta": factura.descuExenta,
        "descuGravada": factura.descuGravada,
        "porcentajeDescuento": 0,
        "totalDescu": factura.descuento,
        "tributos": null,
        "subTotal": factura.total,
        "ivaRete1": factura.iva_retenido,
        "reteRenta": 0,
        "montoTotalOperacion": factura.total,
        "totalPagar": factura.total,
        "totalLetras": NumeroALetras(parseFloat(factura.total.toFixed(2))).toUpperCase(),
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


  async generateDTEIP(factura: any) {
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
        "cantidad": element.cantidad,
        "codigo": element.codigo,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_unitario,
        "montoDescu": element.descuento,
        "ventaGravada": element.venta_grabada,
        "tributos": null,
        "noGravado": 0
      });
    }

    console.log(factura.Cliente)
    const contingencia = await this.prisma.contingenciasDetalle.findFirst({ where: { id_factura: factura.id_factura }, include: { Contingencias: true } });
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": contingencia != null ? 2 : 1,
        "tipoOperacion": contingencia != null ? 2 : 1,
        "tipoContingencia": contingencia != null ? contingencia.Contingencias.tipo : null,
        "motivoContigencia": contingencia != null ? contingencia.Contingencias.motivo : null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "otrosDocumentos": null,
      "emisor": {
        "nit": eliminarGuionesYEspacios(dataSistem.nit),
        "nrc": eliminarGuionesYEspacios(dataSistem.nrc),
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
        "telefono": "(503) " + dataSistem.contactos,
        "codPuntoVentaMH": dataSistem.cod_punto_venta_MH != null && dataSistem.cod_punto_venta_MH.length > 0 ? dataSistem.cod_punto_venta_MH : null,
        "codPuntoVenta": dataSistem.cod_punto_venta != null && dataSistem.cod_punto_venta.length > 0 ? dataSistem.cod_punto_venta : null,
        "codEstableMH": dataSistem.cod_estable_MH != null && dataSistem.cod_estable_MH.length > 0 ? dataSistem.cod_estable_MH : null,
        "codEstable": dataSistem.cod_estable != null && dataSistem.cod_estable.length > 0 ? dataSistem.cod_estable : null,
        "correo": dataSistem.correo,

        "tipoItemExpor": factura.tipoItemExpor,
        "recintoFiscal": factura.recintoFiscal,
        "regimen": factura.regimen
      },
      "receptor": {
        "tipoDocumento": factura.Cliente.DTETipoDocumentoIdentificacion != null ? factura.Cliente.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocumento": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? eliminarGuionesYEspacios(factura.Cliente.dui) : null,
        "nombre": factura.Cliente.nombre,
        "descActividad": factura.Cliente.DTEActividadEconomica != null ? factura.Cliente.DTEActividadEconomica.nombre : null,
        "complemento": (factura.Cliente.Municipio == null || factura.Cliente.id_municipio == null) ? null
          : factura.Cliente.direccion,
        "telefono": (factura.Cliente.telefono != null && factura.Cliente.telefono).length > 0 ? factura.Cliente.telefono : null,
        "correo": (factura.Cliente.correo != null && factura.Cliente.correo.length > 0) ? factura.Cliente.correo : null,
        "nombreComercial": factura.Cliente.razon_social != null ? factura.Cliente.razon_social : null,

        "codPais": factura.Cliente.DTEPais.codigo,
        "nombrePais": factura.Cliente.DTEPais.valor,
        "tipoPersona": 1,
      },
      "ventaTercero": null,
      "cuerpoDocumento": [
        ...detalle
      ],
      "resumen": {
        "totalGravada": factura.totalGravada,
        "totalNoGravado": 0,
        "porcentajeDescuento": 0,
        "totalDescu": factura.descuento,
        "montoTotalOperacion": factura.total,
        "totalPagar": factura.total,
        "totalLetras": NumeroALetras(parseFloat(factura.total.toFixed(2))).toUpperCase(),
        "condicionOperacion": 1,
        "pagos": null,
        "numPagoElectronico": null,
        "descuento": factura.descuento,
        "observaciones": null,
        "flete": factura.flete,
        "seguro": factura.seguro,
        "codIncoterms": factura.codIncoterms,
        "descIncoterms": factura.descIncoterms,

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

  async generateDTESU(factura: any) {
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
        "cantidad": element.cantidad,
        "codigo": element.codigo,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_unitario,
        "montoDescu": element.descuento,
        "tipoItem": element.Catalogo.id_tipo == 1 ? 2 : 1,
        "compra": element.venta_grabada,

      });
    }

    console.log(factura.Cliente)
    const contingencia = await this.prisma.contingenciasDetalle.findFirst({ where: { id_factura: factura.id_factura }, include: { Contingencias: true } });
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": contingencia != null ? 2 : 1,
        "tipoOperacion": contingencia != null ? 2 : 1,
        "tipoContingencia": contingencia != null ? contingencia.Contingencias.tipo : null,
        "motivoContin": contingencia != null ? contingencia.Contingencias.motivo : null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "emisor": {
        "nit": eliminarGuionesYEspacios(dataSistem.nit),
        "nrc": eliminarGuionesYEspacios(dataSistem.nrc),
        "nombre": dataSistem.nombre_sistema,
        "codActividad": dataSistem.cod_actividad,
        "descActividad": dataSistem.desc_actividad,
        "direccion": {
          "departamento": factura.Sucursal.Municipio.Departamento.codigo,
          "municipio": factura.Sucursal.Municipio.codigo,
          "complemento": factura.Sucursal.complemento
        },
        "telefono": "(503) " + dataSistem.contactos,
        "codPuntoVentaMH": dataSistem.cod_punto_venta_MH != null && dataSistem.cod_punto_venta_MH.length > 0 ? dataSistem.cod_punto_venta_MH : null,
        "codPuntoVenta": dataSistem.cod_punto_venta != null && dataSistem.cod_punto_venta.length > 0 ? dataSistem.cod_punto_venta : null,
        "codEstableMH": dataSistem.cod_estable_MH != null && dataSistem.cod_estable_MH.length > 0 ? dataSistem.cod_estable_MH : null,
        "codEstable": dataSistem.cod_estable != null && dataSistem.cod_estable.length > 0 ? dataSistem.cod_estable : null,
        "correo": dataSistem.correo
      },
      "sujetoExcluido": {
        "tipoDocumento": factura.Cliente.DTETipoDocumentoIdentificacion != null ? factura.Cliente.DTETipoDocumentoIdentificacion.codigo : null,
        "numDocumento": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? eliminarGuionesYEspacios(factura.Cliente.dui) : null,
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
      "cuerpoDocumento": [
        ...detalle
      ],
      "resumen": {
        "totalCompra": factura.totalGravada,
        "descu": 0.00,
        "totalDescu": 0.00,
        "subTotal": factura.subtotal,
        "ivaRete1": 0.00,
        "reteRenta": 0.00,
        "totalPagar": factura.total,
        "totalLetras": NumeroALetras(parseFloat(factura.total.toFixed(2))).toUpperCase(),
        "condicionOperacion": 1,
        "pagos": null,
        "observaciones": null,
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
    } else if (factura.Bloque.Tipo.codigo == "11") {
      token = await this.generateDTEIP(factura);
    } else if (factura.Bloque.Tipo.codigo == "14") {
      token = await this.generateDTESU(factura);
    }
    return await this.envairFactura(factura, token);
  }
  async generarContingencia(id_contingencia: any) {

    const dataSistem = await this.prisma.generalData.findFirst();
    const contingencia = await this.prisma.contingencias.findFirst({ where: { id_contingencia }, include: { Usuarios: { include: { DTETipoDocumentoIdentificacion: true, Sucursales: { include: { DTETipoEstablecimiento: true } } } }, ContingenciasDetalle: true } });

    let fechaFormateada = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let uuid = uuidv5(contingencia.id_contingencia.toString(), uuidv4());
    let arrayDte = [];
    let index = 1;
    for (let item of contingencia.ContingenciasDetalle) {
      arrayDte.push({
        "noItem": index,
        "codigoGeneracion": item.codigoGeneracion,
        "tipoDoc": item.tipoDoc
      });
      index++;
    }

    let data = {
      "identificacion": {
        "version": 3,
        "ambiente": dataSistem.ambiente,
        "codigoGeneracion": uuid.toUpperCase(),
        "fTransmision": fechaFormateada.toString().split(' ')[0],
        "hTransmision": fechaFormateada.toString().split(' ')[1]
      },
      "emisor": {
        "nit": eliminarGuionesYEspacios(dataSistem.nit),
        "nombre": dataSistem.nombre_sistema,
        "nombreResponsable": contingencia.Usuarios.nombres + ' ' + contingencia.Usuarios.apellidos,
        "tipoDocResponsable": contingencia.Usuarios.DTETipoDocumentoIdentificacion != null ? contingencia.Usuarios.DTETipoDocumentoIdentificacion.codigo : null,
        "numeroDocResponsable": contingencia.Usuarios.dui,
        "tipoEstablecimiento": contingencia.Usuarios.Sucursales.DTETipoEstablecimiento != null ? contingencia.Usuarios.Sucursales.DTETipoEstablecimiento.codigo : null,
        "codPuntoVenta": dataSistem.cod_punto_venta != null && dataSistem.cod_punto_venta.length > 0 ? dataSistem.cod_punto_venta : null,
        "codEstableMH": dataSistem.cod_estable_MH != null && dataSistem.cod_estable_MH.length > 0 ? dataSistem.cod_estable_MH : null,
        "telefono": eliminarGuionesYEspacios(dataSistem.contactos),
        "correo": dataSistem.correo
      },
      "detalleDTE": [
        ...arrayDte
      ],
      "motivo": {
        "fInicio": contingencia.fecha_inicio,
        "fFin": contingencia.fecha_fin,
        "hInicio": contingencia.hora_inicio + ":00",
        "hFin": contingencia.hora_fin + ":00",
        "tipoContingencia": contingencia.tipo,
        "motivoContingencia": contingencia.motivo
      }
    }
    console.log(data)
    let token = await this.firmarDocumento(data, dataSistem);
    const respContingencia = await this.envairContingencia(dataSistem.nit, token, id_contingencia);
    this.iniciarEnvioContingencia(contingencia, id_contingencia);
    return respContingencia;
  }
  async iniciarEnvioContingencia(contingencia, id_contingencia) {
    let arrayIdsFacturas = [];
    for (let factura of contingencia.ContingenciasDetalle) {
      arrayIdsFacturas.push(factura.id_factura);
    }
    const facturas_list = await this.prisma.facturas.findMany({
      where: {
        id_factura: {
          in: arrayIdsFacturas
        },
        estado: 'ACTIVO',
        dte_procesado: false,
      }, include: {
        FacturasDetalle: true,
        Sucursal: {
          include: {
            DTETipoEstablecimiento: true,
            Municipio: { include: { Departamento: true } },
          },
        },
        Bloque: {
          include: {
            Tipo: true,
          },
        },
        Cliente: {
          include: {
            Municipio: { include: { Departamento: true } },
            DTEActividadEconomica: true,
            DTETipoDocumentoIdentificacion: true,
          },
        },
      },
    });
    let arrayTokens = [];
    for (let index = 0; index < facturas_list.length; index++) {
      const factura = facturas_list[index];
      let token = '';
      if (factura.Bloque.Tipo.codigo == "01") {
        token = await this.generateDTEFC(factura);
      } else if (factura.Bloque.Tipo.codigo == "03") {
        token = await this.generateDTECCF(factura);
      }
      arrayTokens.push(token);
    }
    await this.envairLoteFactura(arrayTokens, id_contingencia);
  }


  async envairContingencia(nit: any, token: string, id_contingencia: number) {
    var data = {
      // "ambiente": dataSistem.ambiente,
      // "idEnvio": 1,
      // "version": factura.Bloque.Tipo.version,
      // "tipoDte": factura.Bloque.Tipo.codigo,
      // "codigoGeneracion": "2",
      "nit": nit,
      "documento": token
    }
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/contingencia`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      console.log(path_)
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      if (respuesta.status == 200 && respuesta.data.estado != null && respuesta.data.estado == 'RECIBIDO') {
        await this.prisma.contingencias.update({
          where: { id_contingencia },
          data: {
            json_response: JSON.stringify(respuesta.data)
          }
        });
      } else {
        throw new InternalServerErrorException(respuesta.data.observaciones.toString())
      }
      return respuesta.data;
    } catch (error) {
      if ((error.response.data == null) && error.response.message != null) {
        throw new InternalServerErrorException(error.response.message)
      }
      let msjError = '';
      if (error.response == undefined) {
        msjError += "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      } else {
        console.log(error.response) // Mensaje de error
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
        }
      }

      throw new InternalServerErrorException(msjError)
    }
  }

  async obtenerNuevoToken(generalData: GeneralData) {
    let path_ = `${this.configService.get('API_FACTURACION')}seguridad/auth`;
    let nit = generalData.nit != null && generalData.nit.length > 0 ? generalData.nit.replace(" ", "").replace("-", "") : "00000";
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        "user": nit,
        "pwd": generalData.public_key,
      }, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      console.log(path_)
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
      if (error.response == undefined) {
        return "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      }
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

  async envairLoteFactura(facturas: any, id_contingencia: number) {
    const dataSistem = await this.prisma.generalData.findFirst();
    var data = {
      "ambiente": dataSistem.ambiente,
      "idEnvio": uuidv4().toUpperCase(),
      "version": 2,
      "nitEmisor": eliminarGuionesYEspacios(dataSistem.nit),
      "documentos": [...facturas]
    }
    console.log(data)
    console.timeStamp()
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/recepcionlote/`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      console.log(path_)
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      if (respuesta.status == 200) {
        await this.prisma.contingencias.update({
          where: { id_contingencia },
          data: {
            json_lote: JSON.stringify(respuesta.data),
          }
        });
      }
      return respuesta.data;
    } catch (error) {
      let msjError = '';
      if (error.response == undefined) {
        msjError += "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      } else {
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
        }
      }
      return msjError;
    }
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
    console.log(data)
    console.timeStamp()
    let path_ = `${this.configService.get('API_FACTURACION')}fesv/recepciondte`;
    var jwt = await this.validarToken();
    const config: AxiosRequestConfig = {
      timeout: TIMEOUTAXIOS,
      signal: AbortSignal.timeout(TIMEOUTAXIOS),
      method: 'post', // Especifica el método HTTP
      url: path_,       // URL a la que se realizará la solicitud
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido esperado 
        'Authorization': 'Bearer ' + jwt, // Especifica el tipo de contenido esperado 
      },
      data, // Los datos que se enviarán en el cuerpo de la solicitud
    };
    try {
      console.log(path_)
      const respuesta: AxiosResponse = await axios.request(config);
      console.log(respuesta.data)
      console.log(respuesta.status)
      console.log(respuesta.data.observaciones)
      if (respuesta.status == 200) {
        await this.prisma.facturas.update({
          where: { id_factura: factura.id_factura },
          data: {
            response_dte_json: JSON.stringify(respuesta.data),
            dte_procesado: true,
          }
        });
        const factura_s = await this.prisma.facturas.findFirst({
          where: { id_factura: factura.id_factura },
          include: {
            FacturasDetalle: true,
            Sucursal: { include: { DTETipoEstablecimiento: true, Municipio: { include: { Departamento: true } } } },
            Bloque: {
              include: {
                Tipo: true,
              },
            },
            Cliente: {
              include: {
                Municipio: { include: { Departamento: true } },
                DTEActividadEconomica: true,
                DTETipoDocumentoIdentificacion: true,
              }
            }
          },
        });
        var jsonDte = JSON.parse(factura_s.dte_json);
        jsonDte.firmaElectronica = token;
        jsonDte.selloRecibido = respuesta.data.selloRecibido;
        if (verifyEmail(factura_s.Cliente.correo ?? "") && factura_s.Cliente.correo.length > 0) {
          this.serviceEmail.sendEmailInvoice(factura_s, jsonDte);
        }

      }
      return respuesta.data;
    } catch (error) {
      console.log("error=====================>")
      let msjError = '';
      if (error.response == undefined) {
        msjError += "Error de conexion con el serviodr de MH, favor intentarlo nuevamente mas tarde";
      } else {
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
        }
      }
      await this.prisma.facturas.update({
        where: { id_factura: factura.id_factura },
        data: {
          dte_errores: msjError
        }
      });
      return msjError;
    } finally {
      console.timeEnd()
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
        "codigo": element.codigo,
        "codTributo": null,
        "uniMedida": 99,
        "descripcion": element.nombre,
        "precioUni": element.precio_unitario,
        "montoDescu": element.descuento,
        "ventaNoSuj": element.venta_nosujeto,
        "ventaExenta": element.venta_exenta,
        "ventaGravada": element.venta_grabada,
        "tributos": element.tipo_detalle == "GRABADO" ? [
          "20"
        ] : null,
        "psv": 0,
        "noGravado": 0,
      });
    }

    const contingencia = await this.prisma.contingenciasDetalle.findFirst({ where: { id_factura: factura.id_factura }, include: { Contingencias: true } });
    console.log("contingencia")
    console.log(contingencia)
    let data = {
      "identificacion": {
        "version": factura.Bloque.Tipo.version,
        "ambiente": dataSistem.ambiente,
        "tipoDte": factura.Bloque.Tipo.codigo,
        "numeroControl": numeroControl,
        "codigoGeneracion": uuid.toUpperCase(),
        "tipoModelo": contingencia != null ? 2 : 1,
        "tipoOperacion": contingencia != null ? 2 : 1,
        "tipoContingencia": contingencia != null ? contingencia.Contingencias.tipo : null,
        "motivoContin": contingencia != null ? contingencia.Contingencias.motivo : null,
        "fecEmi": fechaFormateada.toString().split(' ')[0],
        "horEmi": fechaFormateada.toString().split(' ')[1],
        "tipoMoneda": "USD"
      },
      "documentoRelacionado": null,
      "otrosDocumentos": null,
      "emisor": {
        "nit": eliminarGuionesYEspacios(dataSistem.nit),
        "nrc": eliminarGuionesYEspacios(dataSistem.nrc),
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
        "nit": (factura.Cliente.dui != null && factura.Cliente.dui.length > 0) ? eliminarGuionesYEspacios(factura.Cliente.dui) : null,
        "nrc": factura.Cliente.registro_nrc != null && factura.Cliente.registro_nrc != "" && factura.Cliente.registro_nrc != "N/A" ? eliminarGuionesYEspacios(factura.Cliente.registro_nrc) : null,
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
        "totalNoSuj": factura.totalNoSuj,
        "totalExenta": factura.totalExenta,
        "totalGravada": factura.totalGravada,
        "subTotalVentas": factura.subtotal,
        "descuNoSuj": factura.descuNoSuj,
        "descuExenta": factura.descuExenta,
        "descuGravada": factura.descuGravada,
        "porcentajeDescuento": 0,
        "totalDescu": 0,
        "tributos": [
          {
            "codigo": "20",
            "descripcion": "Impuesto al Valor Agregado 13%",
            "valor": factura.iva
          }
        ],
        "subTotal": factura.subtotal,
        "ivaPerci1": 0,
        "ivaRete1": factura.iva_retenido,
        "reteRenta": 0,
        "montoTotalOperacion": factura.total,
        "totalNoGravado": 0,
        "totalPagar": factura.total,
        "totalLetras": NumeroALetras(parseFloat(factura.total.toFixed(2))).toUpperCase(),
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
        "observaciones": `TOTAL TRANSACCION ES POR $ ${Number(factura.total.toFixed(2))}`,
        "placaVehiculo": null
      },
      "apendice": null
    }
    console.log("afkldsjhgkjsdhfgkjsdfklgjsldkjhfgsjldhkfghjksdfghjlksdfhjghkjldsgfhkjsdfgjhldf")
    console.log(data)
    console.log("afkldsjhgkjsdhfgkjsdfklgjsldkjhfgsjldhkfghjksdfghjlksdfhjghkjldsgfhkjsdfgjhldf")
    await this.prisma.facturas.update({
      where: { id_factura: factura.id_factura },
      data: {
        dte_json: JSON.stringify(data)
      }
    });
    return await this.firmarDocumento(data, dataSistem);
  }

  async resendEmails(id_factura: number) {

    const factura_s = await this.prisma.facturas.findFirst({
      where: { id_factura },
      include: {
        FacturasDetalle: true,
        Sucursal: { include: { DTETipoEstablecimiento: true, Municipio: { include: { Departamento: true } } } },
        Bloque: {
          include: {
            Tipo: true,
          },
        },
        Cliente: {
          include: {
            Municipio: { include: { Departamento: true } },
            DTEActividadEconomica: true,
            DTETipoDocumentoIdentificacion: true,
          }
        }
      },
    });

    var jsonDte = JSON.parse(factura_s.dte_json);
    var respSello = JSON.parse(factura_s.response_dte_json);
    const dataSistem = await this.prisma.generalData.findFirst();
    let token = await this.firmarDocumento(jsonDte, dataSistem);
    jsonDte.firmaElectronica = token;
    jsonDte.selloRecibido = respSello.selloRecibido;
    if (verifyEmail(factura_s.Cliente.correo ?? "") && factura_s.Cliente.correo.length > 0) {
      return this.serviceEmail.sendEmailInvoice(factura_s, jsonDte);
    }
  }

}
