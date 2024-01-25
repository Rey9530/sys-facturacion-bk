import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { PrismaService } from 'src/common/services';
import { PaginationProveedoresDto } from './dto/pagintaion-proveedores.dto';
import { Usuarios } from '@prisma/client';

@Injectable()
export class ProveedoresService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createProveedoreDto: CreateProveedoreDto, user: Usuarios) {
    let {
      nombre = "",
      giro = "",
      razon_social = "",
      registro_nrc = "",
      nit = "",
      id_municipio = 0,
      dias_credito = 0,
      direccion = "",
      dui = "",
      nombre_contac_1 = "",
      telefono_contac_1 = "",
      correo_contac_1 = "",
      nombre_contac_2 = "",
      telefono_contac_2 = "",
      correo_contac_2 = "",
      nombre_contac_3 = "",
      telefono_contac_3 = "",
      correo_contac_3 = "",
      id_tipo_proveedor = 0,
      id_banco = 0,
      no_cuenta = "",
      tipo_cuenta = "",
    }: any = createProveedoreDto;
    id_tipo_proveedor = Number(id_tipo_proveedor);
    id_tipo_proveedor = id_tipo_proveedor > 0 ? id_tipo_proveedor : null;
    if (id_tipo_proveedor > 0) {
      const tipoCliente = await this.prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente: id_tipo_proveedor },
      });
      if (!tipoCliente) throw new NotFoundException("El tipo seleccionado no existe ")
    }

    let id_usuario = Number(user.id);
    id_municipio = Number(id_municipio);
    id_banco = Number(id_banco);
    id_municipio = id_municipio > 0 ? id_municipio : null;
    id_banco = id_banco > 0 ? id_banco : null;
    if (id_municipio > 0) {
      const municipio = await this.prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) throw new NotFoundException("El municipio seleccionado no existe")
    } else {
      id_municipio = null;
    }
    if (id_banco > 0) {
      const banco = await this.prisma.bancos.findFirst({
        where: { id_banco },
      });
      if (!banco) throw new NotFoundException("El banco seleccionado no existe")
    } else {
      id_banco = null;
    }
    try {

      let respImagen: any = {};

      //TODO:FINALIZAR
      // if (req.files && Object.keys(req.files).length > 0) {
      //   respImagen = await subirArchivo(req.files);
      // }
      let foto_obj_nrc = JSON.stringify(respImagen);
      let foto_url_nrc = respImagen.secure_url ? respImagen.secure_url : "";



      const data: any = await this.prisma.proveedores.create({
        data: {
          nombre,
          giro,
          razon_social,
          registro_nrc,
          nit,
          id_municipio,
          direccion,
          dui,
          dias_credito:dias_credito.toString(),
          nombre_contac_1,
          telefono_contac_1,
          correo_contac_1,
          nombre_contac_2,
          telefono_contac_2,
          correo_contac_2,
          nombre_contac_3,
          telefono_contac_3,
          correo_contac_3,
          id_tipo_proveedor,
          foto_obj_nrc,
          foto_url_nrc,
          id_banco,
          no_cuenta,
          tipo_cuenta,
          id_usuario
        },
      });
      delete data.foto_obj_nrc;
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async listadoBancos() {
    return await this.prisma.bancos.findMany({
      where: {
        Estado: "ACTIVO"
      }
    });
  }

  async listadoTiposContrinuyentes() {
    return await this.prisma.tiposCliente.findMany({
      where: { estado: "ACTIVO" },
    });
  }

  async findAll(pagination: PaginationProveedoresDto) {
    let { pagina = 1, registrosXpagina = 10, query = "" } = pagination;
    pagina = Number(pagina);
    registrosXpagina = Number(registrosXpagina);
    pagina = pagina > 0 ? pagina : 0;
    registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;

    let consultas = [];
    if (query.length > 3) {
      let array = query.split(" ");
      consultas = array.map((contains: any) => {
        return {
          AND: [
            {
              OR: [
                { nombre: { contains } },
                { giro: { contains } },
                { razon_social: { contains } },
                { registro_nrc: { contains } },
                { nit: { contains } },
                { direccion: { contains } },
                { dui: { contains } },
              ],
            },
          ],
        };
      });
    }
    const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
    const total = await this.prisma.proveedores.count({ where });
    const data = await this.prisma.proveedores.findMany({
      where,
      include: { Municipio: true, TipoProveedor: true },
      take: registrosXpagina,
      skip: (pagina - 1) * registrosXpagina,
    });
    const totalFiltrado = await data.length;
    return {
      total,
      totalFiltrado,
      pagina,
      registrosXpagina,
      data,
    }
  }

  async findInvoice(id_proveedor: number) {
    return await this.prisma.compras.findMany({
      where: {
        id_proveedor
      },
      include: { Sucursales: true, FacturasTipos: true }
    });
  }

  async findOne(uid: number) {
    const registros = await this.prisma.proveedores.findFirst({
      where: { id_proveedor: uid, estado: "ACTIVO" },
      include: {
        Municipio: { include: { Departamento: true } },
        TipoProveedor: true,
      },
    });
    if (!registros) throw new NotFoundException("El registro no existe  ")
    return registros;
  }
  findOne2(id: number) {
    return `This action returns a #${id} proveedore`;
  }

  async update(id_proveedor: number, updateProveedoreDto: UpdateProveedoreDto) {

    let {
      nombre = "",
      giro = "",
      razon_social = "",
      registro_nrc = "",
      nit = "",
      id_municipio = 0,
      dias_credito = 0,
      direccion = "",
      dui = "",
      nombre_contac_1 = "",
      telefono_contac_1 = "",
      correo_contac_1 = "",
      nombre_contac_2 = "",
      telefono_contac_2 = "",
      correo_contac_2 = "",
      nombre_contac_3 = "",
      telefono_contac_3 = "",
      correo_contac_3 = "",
      id_tipo_proveedor = 0,

      id_banco = 0,
      no_cuenta = "",
      tipo_cuenta = "",
    }: any = updateProveedoreDto;
    id_municipio = Number(id_municipio);
    id_tipo_proveedor = Number(id_tipo_proveedor);
    id_banco = Number(id_banco);
    id_municipio = id_municipio > 0 ? id_municipio : null;
    id_banco = id_banco > 0 ? id_banco : null;
    id_tipo_proveedor = id_tipo_proveedor > 0 ? id_tipo_proveedor : null;

    const registro = await this.prisma.proveedores.findFirst({
      where: { id_proveedor, estado: "ACTIVO" },
    });
    if (!registro) throw new NotFoundException("El registro no existe ")
    let foto_obj_nrc: any = registro.foto_obj_nrc;
    let foto_url_nrc = registro.foto_url_nrc;
    // if (req.files && Object.keys(req.files).length > 0) {
    //   try {
    //     let respn: any = await subirArchivo(req.files);
    //     foto_url_nrc = respn.secure_url;
    //     foto_obj_nrc = JSON.stringify(respn);
    //     if (
    //       registro.foto_obj_nrc != "" &&
    //       registro.foto_obj_nrc != "{}" &&
    //       registro.foto_obj_nrc != null &&
    //       registro.foto_obj_nrc.length > 0
    //     ) {
    //       let imagenActual = JSON.parse(registro.foto_obj_nrc);
    //       await eliminarArchivoCloudinary(imagenActual.public_id);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    if (id_tipo_proveedor > 0) {
      const tipoCliente = await this.prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente: id_tipo_proveedor },
      });
      if (!tipoCliente) throw new NotFoundException("El tipo de cliente seleccionado no existe ")

    }

    if (id_municipio > 0) {
      const municipio = await this.prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio) throw new NotFoundException("El municipio seleccionado no existe ")
    } else {
      id_municipio = null;
    }
    try {

      const data: any = await this.prisma.proveedores.update({
        where: { id_proveedor },
        data: {
          nombre,
          giro,
          razon_social,
          registro_nrc,
          nit,
          id_municipio,
          direccion,
          dui,
          dias_credito:dias_credito.toString(),
          nombre_contac_1,
          telefono_contac_1,
          correo_contac_1,
          nombre_contac_2,
          telefono_contac_2,
          correo_contac_2,
          nombre_contac_3,
          telefono_contac_3,
          correo_contac_3,
          id_tipo_proveedor,
          foto_obj_nrc,
          foto_url_nrc,
          id_banco,
          no_cuenta,
          tipo_cuenta,
        },
      });
      delete data.foto_obj_nrc;
      return data;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async remove(uid: number) {
    await this.findOne(uid);
    try {

      await this.prisma.proveedores.update({
        data: { estado: "INACTIVO" },
        where: { id_proveedor: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }
}
