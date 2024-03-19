import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Usuarios } from '@prisma/client';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import {
  CreateFacturaDto,
  UpdateFacturaDto,
  CierreManualTDO,
  BuscartCatalogoDto,
  FechasFacturaDto,
  ContingencyDto,
} from './dto';

@Controller('facturacion/factura')
@ApiTags('Facturas')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) { }

  @Post()
  create(
    @Body() createFacturaDto: CreateFacturaDto,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.create(createFacturaDto, user);
  }

  @Post("crear/contingencia")
  createContingencia(
    @Body() contingency: ContingencyDto,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.createContingencia(contingency, user);
  }
  @Post('cierre_manual')
  cierreManual(@Body() dataDto: CierreManualTDO, @GetUser() user: Usuarios) {
    return this.facturaService.cierreManual(dataDto, user);
  }
  @Post('buscar/catalogo')
  buscarCatalogo(
    @Body() dataDto: BuscartCatalogoDto,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.buscarCatalogo(dataDto, user);
  }
  @Post('buscar/clientes')
  buscarClientes(
    @Body() dataDto: BuscartCatalogoDto,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.buscarClientes(dataDto, user);
  }

  @Get('obtener_metodos_pago')
  obntenerMetodosDePago() {
    return this.facturaService.obntenerMetodosDePago();
  }
  @Get('obtener/datos-extras')
  datosExtras() {
    return this.facturaService.datosExtras();
  }

  @Get('obtener_listado_facturas')
  obtenerListadoFacturas(
    @Query() data: FechasFacturaDto,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.obtenerListadoFacturas(data, user);
  }

  @Get('listado_error_dte')
  listadoFacturasErrorDTE() {
    return this.facturaService.listadoFacturasErrorDTE();
  }

  @Get('obtener_departamentos')
  obtenerListadoDepartamentos() {
    return this.facturaService.obtenerListadoDepartamentos();
  }

  @Get('obtener/:id')
  getNumeroFactura(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.getNumeroFactura(id, user);
  }

  @Get('resend_dte/:id')
  resendDte(@Param('id', ParseIntPipe) id: number, @GetUser() user: Usuarios) {
    return this.facturaService.resendDte(id, user);
  }

  @Get('resend_email/:id')
  resendEmailDte(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.resendEmailDte(id);
  }

  @Get('obtener_municipios/:id')
  obtenerListadoMunicipios(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.obtenerListadoMunicipios(id);
  }

  @Get('obtener_factura/:id')
  obtenerFactura(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.obtenerFactura(id, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturaService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacturaDto: UpdateFacturaDto,
  ) {
    return this.facturaService.update(+id, updateFacturaDto);
  }

  @Delete('anular_factura/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('tipeInvalidation', ParseIntPipe) tipeInvalidation: number,
    @Query('motiveInvalidation') motiveInvalidation: string,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.remove(
      id,
      user,
      tipeInvalidation,
      motiveInvalidation,
    );
  }

  @Delete('debit_factura/:id')
  debitRmove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.removeDebit(
      id,
      user, 
    );
  }


  @Delete('anular_factura_sin_dte/:id')
  removeSinDTE(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.facturaService.removeSinDTE(
      id,
      user,
    );
  }
}
