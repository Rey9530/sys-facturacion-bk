import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { CompraslDto } from './dto/compras.dto';
import { ComprasContadoDto } from './dto/compras.contado.dto';

@ApiTags('Compras')
@Controller('reportes/compras')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) { }


  @Get("libro_compras")
  libroCompras(
    @Query() params: CompraslDto,
  ) {
    return this.comprasService.libroCompras(params);
  }
  @Get("listado_compras_contado")
  libroComprasContado(
    @Query() params: ComprasContadoDto,
  ) {
    return this.comprasService.libroComprasContado(params);
  }

  @Get("obtener_listado_compras")
  obtenerListadoCompras(
    @Query() params: CompraslDto,
  ) {
    return this.comprasService.obtenerListadoCompras(params);
  }


  @Get("obtener_listado_compras_inventario")
  obtenerListadoComprasInventario(
    @Query() params: CompraslDto,
  ) {
    return this.comprasService.obtenerListadoComprasInventario(params);
  }
  @Get("obtener_listado_compras_al_credito/:id_sucursal/:id_proveedor")
  obtenerListadoComprasCredito(
    @Query('id_sucursal', ParseIntPipe) id_sucursal: number,
    @Query('id_proveedor', ParseIntPipe) id_proveedor: number,
  ) {
    return this.comprasService.obtenerListadoComprasCredito(id_sucursal, id_proveedor);
  }
  @Get("obtener_pre_cheques/:id_sucursal")
  obtenerPreCheques(
    @Query('id_sucursal', ParseIntPipe) id_sucursal: number,
  ) {
    return this.comprasService.obtenerPreCheques(id_sucursal);
  }

  @Get("revertir_estado/:id_compra")
  revertirEstado(
    @Param('id_compra', ParseIntPipe) id_compra: number,
  ) {
    console.log(id_compra)
    return this.comprasService.revertirEstado(id_compra);
  }
 

  @Delete(':id_compra')
  remove(@Query('id_compra', ParseIntPipe) id_compra: number) {
    return this.comprasService.remove(id_compra);
  }
} 