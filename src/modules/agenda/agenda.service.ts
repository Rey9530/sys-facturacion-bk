import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { PrismaService } from 'src/common/services';
import { GetAgendaDto } from './dto/get-agendar.dto';
import { FechasAgendaDto } from './dto/fechas.dto';

@Injectable()
export class AgendaService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async create(createAgendaDto: CreateAgendaDto, uid = 0) {
    uid = Number(uid);
    let {
      nombre = "",
      id_sucursal = 0,
      zona = "",
      no_personas = "",
      turno = "DESAYUNO",
      telefono = "",
      date = "",
      start = "",
      nota = "",
    }: any = createAgendaDto;
    date = date.split("T")[0];
    start = start.split(":");
    var inicio = new Date(date);
    inicio.setHours(inicio.getHours() + Number(start[0]));
    inicio.setMinutes(inicio.getMinutes() + Number(start[1]));

    var fin = new Date(date);
    fin.setHours(fin.getHours() + Number(start[0]));
    fin.setMinutes(fin.getMinutes() + Number(start[1]));
    fin.setHours(fin.getHours() + 2);
    try {
      id_sucursal = Number(id_sucursal);
      const data = await this.prisma.agenda.create({
        data: {
          zona,
          id_sucursal,
          no_personas,
          nombre,
          telefono,
          inicio,
          fin,
          nota,
          turno,
          id_usuario: uid,
        },
      });
      return data
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async findAll(getAgendaDto: GetAgendaDto) {
    let { id_sucursal = 0, turno = "DESAYUNO" } = getAgendaDto;
    id_sucursal = Number(id_sucursal);
    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    const registros = await this.prisma.agenda.findMany({
      include: { Sucursales: true, Usuario: true },
      where: { ...wSucursal },
    });
    const total = await registros.length;
    var ahora = await this.getRegistrosDelDia(id_sucursal, turno);
    return {
      registros,
      total,
      ahora,
    };
  }

  async getRegistro(id_sucursal: number, query: FechasAgendaDto) {
    var desde_v: any = query.desde!.toString();
    var hasta_v: any = query.hasta!.toString();
    var turno: any = query.turno;
    var desde = new Date(desde_v);
    var hasta = new Date(hasta_v);
    hasta.setHours(hasta.getHours() + 23);
    hasta.setMinutes(hasta.getMinutes() + 59);
    var wMes = {
      fecha_creacion: {
        gte: desde,
        lte: hasta,
      },
    };
    id_sucursal = Number(id_sucursal);
    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }

    var wTurno = {};
    if (turno != null && turno.length > 0) {
      wTurno = { turno };
    }
    const [pendiente, confirmada, completada, cancelada] = await Promise.all([
      await this.prisma.agenda.count({
        where: {
          estado: "PENDIENTE",
          ...wSucursal,
          ...wMes,
          ...wTurno,
        },
      }),
      await this.prisma.agenda.count({
        where: {
          estado: "CONFIRMADA",
          ...wSucursal,
          ...wMes,
          ...wTurno
        },
      }),
      await this.prisma.agenda.count({
        where: {
          estado: "COMPLETADA",
          ...wSucursal,
          ...wMes,
          ...wTurno
        },
      }),
      await this.prisma.agenda.count({
        where: {
          estado: "CANCELADA",
          ...wSucursal,
          ...wMes,
          ...wTurno
        },
      }),
    ]);

    const registros = await this.prisma.agenda.findMany({
      include: { Sucursales: true, Usuario: true },
      where: {
        ...wSucursal,
        ...wMes,
        ...wTurno,
      },
      orderBy: {
        inicio: "asc"
      }
    });
    return {
      registros,
      contadores: {
        pendiente,
        confirmada,
        completada,
        cancelada,
      }
    }
  }

  async update(uid: number, updateAgendaDto: UpdateAgendaDto) {
    try {
      let {
        nombre = "",
        id_sucursal = 0,
        zona = "",
        no_personas = "",
        turno = "DESAYUNO",
        telefono = "",
        date = "",
        start = "",
        nota = "",
      }: any = updateAgendaDto;
      id_sucursal = Number(id_sucursal);

      date = date.split("T")[0];
      start = start.split(":");
      var inicio = new Date(date);
      inicio.setHours(inicio.getHours() + Number(start[0]));
      inicio.setMinutes(inicio.getMinutes() + Number(start[1]));

      var fin = new Date(date);
      fin.setHours(fin.getHours() + Number(start[0]));
      fin.setMinutes(fin.getMinutes() + Number(start[1]));
      fin.setHours(fin.getHours() + 2);

      const [registro, sucursal] = await Promise.all([
        await this.prisma.agenda.findFirst({
          where: { id_agenda: uid },
        }),
        await this.prisma.sucursales.findFirst({
          where: { id_sucursal },
        }),
      ]);
      if (!registro || !sucursal) {
        throw new InternalServerErrorException("El registro no existe o la sucursal esta incorrecta");
      }
      const registroActualizado = await this.prisma.agenda.update({
        where: { id_agenda: uid },
        data: {
          zona,
          id_sucursal,
          no_personas,
          nombre,
          telefono,
          inicio,
          fin,
          nota,
          turno,
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.response.message);
    }
  }

  async updateStatus(uid: number, estado: any = '',) {
    try {
      const [registro] = await Promise.all([
        await this.prisma.agenda.findFirst({
          where: { id_agenda: uid },
        }),
      ]);
      if (!registro) {
        throw new NotFoundException("El registro no existe");
      }
      const registroActualizado = await this.prisma.agenda.update({
        where: { id_agenda: uid },
        data: {
          estado,
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error.response.message);
    }
  }
  async remove(uid: number) {
    const registro = await this.prisma.agenda.findFirst({
      where: { id_agenda: uid, estado: { not: "CANCELADA" } },
    });
    if (!registro) {
      throw new NotFoundException("El registro no existe");
    }
    try {
      await this.prisma.agenda.update({
        data: { estado: "CANCELADA" },
        where: { id_agenda: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async getRegistrosDelDia(id_sucursal = 0, turno: any = "DESAYUNO") {
    id_sucursal = Number(id_sucursal);
    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }

    var wTurno = {};
    if (turno.length > 0) {
      wTurno = { turno };
    }
    var ahora = new Date();
    var y = ahora.getFullYear();
    var m = ahora.getMonth();
    var d = ahora.getDate();
    var desde = new Date(y, m, d, 0, 0, 0);
    var hasta = new Date(y, m, d, 0, 0, 0);
    hasta.setHours(hasta.getHours() + 23);
    const registros = await this.prisma.agenda.findMany({
      include: { Sucursales: true },
      where: {
        ...wSucursal,
        ...wTurno,
        inicio: {
          gte: desde,
          lte: hasta,
        },
        OR: [
          {
            estado: "CONFIRMADA",
          },
          {
            estado: "PENDIENTE",
          },
        ],
      },
      orderBy: {
        inicio: "asc",
      },
    });
    return registros;
  }

  async findOne(uid) {
    const registros = await this.prisma.agenda.findFirst({
      where: { id_agenda: uid },
    });

    if (!registros) {
      throw new NotFoundException("El registro no existe");
    } else {
      return registros;
    }
  }
}
