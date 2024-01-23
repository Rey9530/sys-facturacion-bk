import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Usuarios } from '@prisma/client';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { IngresoService } from './ingreso.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BuscarCatalogoDto,
  CompraServicioDto,
  CreateIngresoDto,
  FechasIngresosDto,
  GenerarAChequeDTS,
  PaginationIngresoDto,
  ServicioRDTO,
  VerificarServicioDto,
  comprasAChequeDTS,
} from './dto';


@Controller('inventario/ingreso')
@ApiTags('Ingreso a inventario')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class IngresoController {
  constructor(private readonly ingresoService: IngresoService) { }

  @Post()
  create(
    @Body() createIngresoDto: CreateIngresoDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.create(createIngresoDto, user);
  }
  @Post("servicio")
  createServicio(
    @Body() createIngresoDto: CompraServicioDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.createServicio(createIngresoDto, user);
  }

  @Post("servicio/verficar")
  servicioVerficar(
    @Body() data: VerificarServicioDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.servicioVerficar(data, user);
  }
  @Post("servicio_r")
  servicioR(
    @Body() data: ServicioRDTO,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.servicioR(data, user);
  }

  @Post("buscar/catalogo")
  buscarCatalogo(
    @Body() data: BuscarCatalogoDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.buscarCatalogo(data, user);
  }
  @Post("buscar/proveedores")
  buscarProveedores(
    @Body() data: BuscarCatalogoDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.buscarCatalogo(data, user);
  }

  @Post("comprasACheque")
  comprasACheque(
    @Body() data: comprasAChequeDTS,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.comprasACheque(data, user);
  }
  @Post("comprasACheque")
  generarACheque(
    @Body() data: GenerarAChequeDTS,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.generarACheque(data, user);
  }

  @Get('obtener/bodegas/:id')
  findBodegas(@Param('id', ParseIntPipe) id: number) {
    return this.ingresoService.findBodegas(id);
  }

  @Get('obtener_factura/:id')
  obtenerFactura(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.obtenerFactura(id, user);
  }

  @Get('proveedor/obtener_listado_compras_al_credito/:id_sucursal')
  findListadoComprasCredito(@Param('id_sucursal', ParseIntPipe) id: number) {
    return this.ingresoService.findBodegas(id);
  }
  @Get('obtener_listado_facturas')
  findListadoFacturas(
    @Query() data: FechasIngresosDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.findListadoFacturas(data, user);
  }
  @Get('listado_existencias')
  listadoExistencias(
    @Query() data: PaginationIngresoDto,
    @GetUser() user: Usuarios
  ) {
    return this.ingresoService.listadoExistencias(data, user);
  }


}
