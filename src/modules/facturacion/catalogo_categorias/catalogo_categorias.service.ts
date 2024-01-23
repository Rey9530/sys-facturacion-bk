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
    let { nombre = "" } = createCatalogoCategoriaDto;
    try {
      const data = await this.prisma.catalogoCategorias.create({
        data: {
          nombre
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

      let { nombre = "" } = updateCatalogoCategoriaDto;
      const registroActualizado = await this.prisma.catalogoCategorias.update({
        where: { id_categoria: uid },
        data: { nombre },
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
