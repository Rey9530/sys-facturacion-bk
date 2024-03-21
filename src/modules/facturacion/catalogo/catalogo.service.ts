import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCatalogoDto } from './dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './dto/update-catalogo.dto';
import { PaginationCatalogoDto } from './dto/pagintaion-catalogo.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class CatalogoService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createCatalogoDto: CreateCatalogoDto) {
    let {
      id_tipo = 0,
      id_categoria = 0,
      codigo = "0000",
      nombre = "",
      descripcion = "",
      precio_con_iva = 0,
      precio_sin_iva = 0,
      existencias_minimas = 0,
      existencias_maximas = 0,
    } = createCatalogoDto;
    const [tipo, categoria] = await Promise.all([
      await this.prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await this.prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]);
    if (!tipo) throw new NotFoundException("El tipo no existe")
    if (!categoria) throw new NotFoundException("La categoria no existe")
    try {
      const data = await this.prisma.catalogo.create({
        data: {
          id_tipo,
          id_categoria,
          codigo,
          nombre,
          descripcion,
          precio_con_iva,
          precio_sin_iva,
          existencias_minimas,
          existencias_maximas
        },
      });
      return data
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error, revisar logs');
    }
  }

  async findAll(querys: PaginationCatalogoDto) {
    let { pagina = "1", registrosXpagina = "10", query = "" }: any = querys;
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
                { codigo: { contains } },
                { nombre: { contains } },
                { descripcion: { contains } },
              ],
            },
          ],
        };
      });
    }
    const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
    const total = await this.prisma.catalogo.count({ where });
    const registros = await this.prisma.catalogo.findMany({
      where,
      include: { Tipo: true, Categorias: { include: { categoria_padre: true } } },
      take: registrosXpagina,
      skip: (pagina - 1) * registrosXpagina,
    });
    const totalFiltrado = await registros.length;
    return {
      total,
      totalFiltrado,
      pagina,
      registrosXpagina,
      registros,
    }
  }

  async findOne(id: number) {
    let uid: number = Number(id);
    const registros = await this.prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
      include: { Tipo: true, Categorias: true },
    });

    if (!registros) {
      throw new NotFoundException("El registro no existe")
    } else {
      return registros;
    }
  }

  async getCode() {
    const registros = await this.prisma.catalogo.findFirst({
      orderBy: { id_catalogo: 'desc' }
    });

    if (registros == null) {

      return 1
        .toString()
        .padStart(4, '0');
    } else {
      return (registros.id_catalogo + 1)
        .toString()
        .padStart(4, '0');

    }
  }

  async update(uid: number, updateCatalogoDto: UpdateCatalogoDto) {
    const registro = await this.prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) throw new NotFoundException("El registro no existe")
    let {
      id_tipo = 0,
      id_categoria = 0,
      codigo = "0000",
      nombre = "",
      descripcion = "",
      precio_con_iva = 0,
      precio_sin_iva = 0,
      existencias_minimas = 0,
      existencias_maximas = 0
    } = updateCatalogoDto;
    const [tipo, categoria] = await Promise.all([
      await this.prisma.catalogoTipo.findFirst({
        where: { id_tipo },
      }),
      await this.prisma.catalogoCategorias.findFirst({
        where: { id_categoria },
      }),
    ]);

    if (!tipo) throw new NotFoundException("El tipo no existe")
    if (!categoria) throw new NotFoundException("La categoria no existe")
    try {
      const registroActualizado = await this.prisma.catalogo.update({
        where: { id_catalogo: uid },
        data: {
          id_tipo,
          id_categoria,
          codigo,
          nombre,
          descripcion,
          precio_con_iva,
          precio_sin_iva,
          existencias_minimas,
          existencias_maximas
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async remove(uid: number) {
    const registro = await this.prisma.catalogo.findFirst({
      where: { id_catalogo: uid, estado: "ACTIVO" },
    });
    if (!registro) throw new NotFoundException("El registro no existe")
    try {
      await this.prisma.catalogo.update({
        data: { estado: "INACTIVO" },
        where: { id_catalogo: uid },
      });
      return "Registro elimiando"
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
}
