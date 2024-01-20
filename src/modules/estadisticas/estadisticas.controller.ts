import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';
import { EstadisticasDto } from './dto/estadisticas.dto';


@ApiTags('Estadisticas')
@Controller('estadisticas')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) { }

  @Get("facturacion/ventas_menusales")
  ventasMenusales(
    @Query('anio', ParseIntPipe) anio: number,
    @GetUser() user: Usuarios
  ) {
    return this.estadisticasService.ventasMenusales(anio, user.id_sucursal);
  }

  @Get("facturacion/ventas_x_rango")
  ventasXRango(
    @Query() query: EstadisticasDto,
    @GetUser() user: Usuarios
  ) {
    return this.estadisticasService.ventasXRango(query, user.id_sucursal);
  }


  @Get("compras/por_proveedores/:id_sucursal")
  porProveedores(
    @Param('id_sucursal', ParseIntPipe) id_sucursal: number,
  ) {
    return this.estadisticasService.porProveedores(id_sucursal);
  }

  @Get("tablero/:id_sucursal/:anio/:mes")
  tablero(
    @Param('id_sucursal', ParseIntPipe) id_sucursal: number,
    @Param('anio', ParseIntPipe) anio: number,
    @Param('mes', ParseIntPipe) mes: number,
  ) {
    return this.estadisticasService.tablero(id_sucursal, anio, mes);
  }



  @Get("compras/tipo_pastel/:id_sucursal")
  porTipoPastel(
    @Param('id_sucursal', ParseIntPipe) id_sucursal: number,
    @Query() query: EstadisticasDto,
  ) {
    return this.estadisticasService.porTipoPastel(id_sucursal, query);
  }

  @Get("compras/tipo_pastel_propinas/:id_sucursal")
  porTipoPastelPropinas(
    @Param('id_sucursal', ParseIntPipe) id_sucursal: number,
    @Query() query: EstadisticasDto,
  ) {
    return this.estadisticasService.porTipoPastelPropinas(id_sucursal, query);
  }

  @Get("compras/por_mes_sucursal")
  porMesSucrusal(
    @Query('anio', ParseIntPipe) anio: number, 
  ) {
    return this.estadisticasService.porMesSucrusal(anio);
  }


}
