import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/common/services';
import { PaginationClienteDto } from './dto/pagintaion-proveedores.dto';
import { Usuarios } from '@prisma/client';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createClienteDto: CreateClienteDto, user: Usuarios) {
    let id_sucursal = Number(user.id_sucursal);
    let {
      nombre = '',
      giro = '',
      razon_social = '',
      registro_nrc = '',
      nit = '',
      id_municipio = 0,
      id_tipo_cliente = 0,
      id_pais = 0,
      id_tipo_documento = 0,
      id_actividad_economica = 0,
      direccion = '',
      telefono = '',
      correo = '',
      dui = '',
    } = createClienteDto;
    let respImagen: any = {};
    // if (req.files && Object.keys(req.files).length > 0) {
    //   respImagen = await subirArchivo(req.files);
    // }
    let foto_obj_nrc = JSON.stringify(respImagen);
    let foto_url_nrc = respImagen.secure_url ? respImagen.secure_url : '';

    id_tipo_cliente = Number(id_tipo_cliente);
    id_tipo_cliente = id_tipo_cliente > 0 ? id_tipo_cliente : null;
    if (id_tipo_cliente > 0) {
      const tipoCliente = await this.prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente },
      });
      if (!tipoCliente)
        throw new NotFoundException(
          'El tipo de cliente seleccionado no existe',
        );
    }
    id_tipo_documento = Number(id_tipo_documento);
    id_tipo_documento = id_tipo_documento > 0 ? id_tipo_documento : null;
    if (id_tipo_documento > 0) {
      const documentoIdentificacion = await this.prisma.dTETipoDocumentoIdentificacion.findFirst({
        where: { id_tipo_documento },
      });
      if (!documentoIdentificacion)
        throw new NotFoundException(
          'El tipo de documento seleccionado no existe',
        );
    }

    id_actividad_economica = Number(id_actividad_economica);
    id_actividad_economica = id_actividad_economica > 0 ? id_actividad_economica : null;
    if (id_actividad_economica > 0) {
      const documentoIdentificacion = await this.prisma.dTEActividadEconomica.findFirst({
        where: { id_actividad: id_actividad_economica },
      });
      if (!documentoIdentificacion)
        throw new NotFoundException(
          'La actividad economica seleccionada no existe',
        );
    }

    id_municipio = Number(id_municipio);
    if (id_municipio > 0) {
      const municipio = await this.prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio)
        throw new NotFoundException('El municipio seleccionado no existe');
    } else {
      id_municipio = null;
    }
    id_pais = Number(id_pais);
    if (id_pais > 0) {
      const municipio = await this.prisma.dTEPais.findFirst({
        where: { id_pais },
      });
      if (!municipio)
        throw new NotFoundException('El municipio seleccionado no existe');
    } else {
      id_pais = null;
    }
    try {
      const data = await this.prisma.cliente.create({
        data: {
          nombre,
          giro,
          razon_social,
          registro_nrc,
          foto_url_nrc,
          foto_obj_nrc,
          nit,
          id_municipio,
          direccion,
          telefono,
          correo,
          dui,
          id_sucursal,
          id_tipo_cliente,
          id_tipo_documento,
          id_actividad_economica,
          id_pais
        },
        select: {
          id_cliente: true,
          nombre: true,
          giro: true,
          razon_social: true,
          registro_nrc: true,
          foto_url_nrc: true,
          nit: true,
          Municipio: { include: { Departamento: true } },
          direccion: true,
          telefono: true,
          correo: true,
          dui: true,
          id_tipo_cliente: true,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async findAll(queryParamas: PaginationClienteDto) {
    let { pagina = 1, registrosXpagina = 10, query = '' } = queryParamas;
    pagina = Number(pagina);
    registrosXpagina = Number(registrosXpagina);
    pagina = pagina > 0 ? pagina : 0;
    registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;

    let consultas = [];
    if (query.length > 3) {
      let array = query.split(' ');
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
                { telefono: { contains } },
                { correo: { contains } },
                { dui: { contains } },
              ],
            },
          ],
        };
      });
    }
    const where = { AND: [{ estado: 'ACTIVO' }, ...consultas] };
    const total = await this.prisma.cliente.count({ where });
    const data = await this.prisma.cliente.findMany({
      where,
      include: { Municipio: true, TipoCliente: true },
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
    };
  }

  async findOne(uid: number) {
    uid = uid > 0 ? uid : 0;
    const registros = await this.prisma.cliente.findFirst({
      where: { id_cliente: uid, estado: 'ACTIVO' },
      include: { Municipio: true, TipoCliente: true },
    });
    if (!registros) throw new NotFoundException('El registro no existe');
    return registros;
  }
  async findAllTipos() {
    return await this.prisma.tiposCliente.findMany({
      where: { estado: 'ACTIVO' },
    });
  }
  async findAllTiposDocumentos() {
    return await this.prisma.dTETipoDocumentoIdentificacion.findMany({
      where: { estado: 'ACTIVO' },
    });
  }
  async findAllActividadEconomica() {
    return await this.prisma.dTEActividadEconomica.findMany({
      where: { estado: 'ACTIVO' },
    });
  }
  async getAllCountry() {
    return await this.prisma.dTEPais.findMany({ orderBy: { valor: 'asc' } });
  }
  async getCatalog() {
    const [departaments, tiposCliente, tiposIdentificacion, actividadEconomica, paises] = await Promise.all([
      await this.prisma.departamentos.findMany({
        where: { estado: 'ACTIVO' },
      }),
      await this.prisma.tiposCliente.findMany({
        where: { estado: 'ACTIVO' },
      }),
      await this.prisma.dTETipoDocumentoIdentificacion.findMany({
        where: { estado: 'ACTIVO' },
      }),
      await this.prisma.dTEActividadEconomica.findMany({
        where: { estado: 'ACTIVO' },
        orderBy: { nombre: 'asc' }
      }),
      await this.prisma.dTEPais.findMany()
    ]);

    return { departaments, tiposCliente, tiposIdentificacion, actividadEconomica, paises }
  }
  async findOneInvoice(uid: number) {
    uid = uid > 0 ? uid : 0;
    const registros = await this.prisma.cliente.findFirst({
      where: { id_cliente: uid, estado: 'ACTIVO' },
      include: { Municipio: true },
    });
    await this.findOne(uid);
    const data = await this.prisma.facturas.findMany({
      where: { id_cliente: uid },
      include: { Bloque: { include: { Tipo: true } } },
    });
    return data;
  }

  async update(uid: number, updateClienteDto: UpdateClienteDto) {
    uid = uid > 0 ? uid : 0;
    const registro = await this.findOne(uid);
    let {
      nombre = '',
      giro = '',
      razon_social = '',
      nit = '',
      id_municipio = 0,
      id_tipo_cliente = 0,
      id_tipo_documento = 0,
      id_actividad_economica = 0,
      id_pais = 0,
      direccion = '',
      telefono = '',
      correo = '',
      dui = '',
      registro_nrc = '',
    } = updateClienteDto;

    let foto_obj_nrc: any = registro.foto_obj_nrc;
    let foto_url_nrc = registro.foto_url_nrc;
    // if (req.files && Object.keys(req.files).length > 0) {
    //   try {
    //     let respn: any = await subirArchivo(req.files);
    //     foto_url_nrc = respn.secure_url;
    //     foto_obj_nrc = JSON.stringify(respn);
    //     if (
    //       registro.foto_obj_nrc != '' &&
    //       registro.foto_obj_nrc != '{}' &&
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

    id_actividad_economica = Number(id_actividad_economica);
    id_actividad_economica = id_actividad_economica > 0 ? id_actividad_economica : null;
    if (id_actividad_economica > 0) {
      const documentoIdentificacion = await this.prisma.dTEActividadEconomica.findFirst({
        where: { id_actividad: id_actividad_economica },
      });
      if (!documentoIdentificacion)
        throw new NotFoundException(
          'La actividad economica seleccionada no existe',
        );
    }

    id_tipo_cliente = Number(id_tipo_cliente);
    id_tipo_cliente = id_tipo_cliente > 0 ? id_tipo_cliente : null;
    if (id_tipo_cliente > 0) {
      const tipoCliente = await this.prisma.tiposCliente.findFirst({
        where: { id_tipo_cliente },
      });
      if (!tipoCliente)
        throw new NotFoundException(
          'El tipo de cliente seleccionado no existe',
        );
    }

    id_tipo_documento = Number(id_tipo_documento);
    id_tipo_documento = id_tipo_documento > 0 ? id_tipo_documento : null;
    if (id_tipo_documento > 0) {
      const documentoIdentificacion = await this.prisma.dTETipoDocumentoIdentificacion.findFirst({
        where: { id_tipo_documento },
      });
      if (!documentoIdentificacion)
        throw new NotFoundException(
          'El tipo de documento seleccionado no existe',
        );
    }

    id_municipio = Number(id_municipio);
    if (id_municipio > 0) {
      const municipio = await this.prisma.municipios.findFirst({
        where: { id_municipio },
      });
      if (!municipio)
        throw new NotFoundException('El municipio seleccionado no existe');
    } else {
      id_municipio = null;
    }

    id_pais = Number(id_pais);
    if (id_pais > 0) {
      const municipio = await this.prisma.dTEPais.findFirst({
        where: { id_pais },
      });
      if (!municipio)
        throw new NotFoundException('El municipio seleccionado no existe');
    } else {
      id_pais = null;
    }
    try {
      const registroActualizado = await this.prisma.cliente.update({
        where: { id_cliente: uid },
        data: {
          nombre,
          giro,
          razon_social,
          registro_nrc,
          nit,
          foto_url_nrc,
          foto_obj_nrc,
          id_municipio,
          direccion,
          telefono,
          correo,
          dui,
          id_tipo_cliente,
          id_tipo_documento,
          id_actividad_economica,
          id_pais
        },
        select: {
          id_cliente: true,
          nombre: true,
          giro: true,
          razon_social: true,
          Municipio: { include: { Departamento: true } },
          registro_nrc: true,
          nit: true,
          id_municipio: true,
          direccion: true,
          telefono: true,
          correo: true,
          dui: true,
          id_tipo_cliente: true,
          DTEPais: true,
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async remove(uid: number) {
    uid = uid > 0 ? uid : 0;
    await this.findOne(uid);
    try {
      await this.prisma.cliente.update({
        data: { estado: 'INACTIVO' },
        where: { id_cliente: uid },
      });
      return 'Registro elimiando';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
}
