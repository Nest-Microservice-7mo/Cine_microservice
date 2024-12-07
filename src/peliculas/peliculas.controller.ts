import { Controller, ParseIntPipe } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  //@Post()
  @MessagePattern({cmd: 'create_movie'})
  create(@Payload() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  //@Get()
  @MessagePattern({cmd: 'find_all_movies'})
  findAll(@Payload() paginatioDto: PaginationDto) {
    return this.peliculasService.findAll(paginatioDto);
  }

  //@Get(':id')
  @MessagePattern({cmd: 'find_one_movie'})
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.peliculasService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({cmd: 'update_movie'})
  update(@Payload() updatePeliculaDto: UpdatePeliculaDto) {
    return this.peliculasService.update(updatePeliculaDto.id, updatePeliculaDto);
  }

  //@Delete(':id')
  @MessagePattern({cmd: 'delete_movie'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.peliculasService.remove(id);
  }
}
