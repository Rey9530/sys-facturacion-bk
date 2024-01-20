import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { GetAgendaDto } from './dto/get-agendar.dto';
import { FechasAgendaDto } from './dto/fechas.dto';
import { Usuarios } from '@prisma/client';

@ApiTags('Agenda')
@Controller('agenda')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) { }

  @Post()
  create(
    @Body() createAgendaDto: CreateAgendaDto,
    @GetUser() user: Usuarios
  ) {
    return this.agendaService.create(createAgendaDto, user.id);
  }

  @Get()
  findAll(@Query() getAgendaDto: GetAgendaDto) {
    return this.agendaService.findAll(getAgendaDto);
  }

  @Get(':id_sucursal')
  getRegistro(
    @Param('id_sucursal') id_sucursal: string,
    @Query() query: FechasAgendaDto,
  ) {
    return this.agendaService.getRegistro(+id_sucursal, query);
  }

  // @Get(':id')
  // findOne(
  //   @Param('id') id: string,
  // ) {
  //   return this.agendaService.findOne(+id);
  // }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAgendaDto: UpdateAgendaDto
  ) {
    return this.agendaService.update(+id, updateAgendaDto);
  }

  @Put('cambiar_estado/:id')
  updateStatus(
    @Param('id') id: string,
    @Query('estado') estado: string,
    @GetUser() user: Usuarios
  ) {
    return this.agendaService.updateStatus(+id, estado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaService.remove(+id);
  }
}
