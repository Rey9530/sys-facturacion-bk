import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PaginationClienteDto } from './dto/pagintaion-proveedores.dto';
import { Usuarios } from '@prisma/client';

@Controller('facturacion/cliente')
@ApiTags('Cliente')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) { }

  @Post()
  create(
    @Body() createClienteDto: CreateClienteDto,

    @GetUser() user: Usuarios,
  ) {
    return this.clienteService.create(createClienteDto, user);
  }

  @Get()
  findAll(@Query() query: PaginationClienteDto) {
    return this.clienteService.findAll(query);
  }
  @Get("obtener/tipos/contribuyentes")
  findAllTipos() {
    return this.clienteService.findAllTipos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.findOne(id);
  }
  @Get('facturas/:id')
  findOneInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.findOneInvoice(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.remove(id);
  }
}
