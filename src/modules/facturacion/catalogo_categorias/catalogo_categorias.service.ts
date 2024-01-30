import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCatalogoCategoriaDto } from './dto/create-catalogo_categoria.dto';
import { UpdateCatalogoCategoriaDto } from './dto/update-catalogo_categoria.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class CatalogoCategoriasService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async create(createCatalogoCategoriaDto: CreateCatalogoCategoriaDto) {
    let { nombre = "", id_categoria_padre = null } = createCatalogoCategoriaDto;
    try {
      const data = await this.prisma.catalogoCategorias.create({
        data: {
          nombre, id_categoria_padre
        },
      });
      return data;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async findAll() {
    const registros = await this.prisma.catalogoCategorias.findMany({
      where: { estado: "ACTIVO" },
      include: { categoria_padre: true },
      orderBy: { id_categoria: "asc" },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    };
  }

  async findAllGroup() {
    const registros = await this.prisma.catalogoCategorias.findMany({
      where: { estado: "ACTIVO", id_categoria_padre: null },
      include: { categoria_hijos: { where: { estado: 'ACTIVO' } } },
      orderBy: { id_categoria: "asc" },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    };
  }

  async findOne(uid: number) {
    const registros = await this.prisma.catalogoCategorias.findFirst({
      where: { id_categoria: uid, estado: "ACTIVO" },
    });

    if (!registros) {
      throw new NotFoundException("El registro no existe");
    } else {
      return registros;
    }
  }

  async update(uid: number, updateCatalogoCategoriaDto: UpdateCatalogoCategoriaDto) {
    await this.findOne(uid);
    try {

      let { nombre = "", id_categoria_padre = null } = updateCatalogoCategoriaDto;
      const registroActualizado = await this.prisma.catalogoCategorias.update({
        where: { id_categoria: uid },
        data: { nombre, id_categoria_padre },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async remove(uid: number) {
    await this.findOne(uid);
    try {
      await this.prisma.catalogoCategorias.update({
        data: { estado: "INACTIVO" },
        where: { id_categoria: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }
}
