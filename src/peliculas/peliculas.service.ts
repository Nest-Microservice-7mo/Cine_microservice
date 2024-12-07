import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PeliculasService extends PrismaClient implements OnModuleInit{
  private readonly logger = new Logger('Movie Service')

  onModuleInit() {
    this.$connect();
    this.logger.log('Base de Datos Conectada');
  }

  create(createPeliculaDto: CreatePeliculaDto) {
    return this.movie.create({ 
      data: createPeliculaDto 
    });
  }

  async findAll(paginatioDto: PaginationDto) {
    const { page, limit } = paginatioDto;
    const totalPages = await this.movie.count({where:{available:true}});
    const lastPage = Math.ceil(totalPages / limit);

    if(page > lastPage) {
      return {
        message: `Page ${page} does not exist`,
        meta: {
          total: totalPages,
          page: page,
          lastPage: lastPage,
        }
      }
    }

    return {
      data: await this.movie.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {available: true}
        }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const movie = await this.movie.findFirst({where:{id, available:true}});
    if(!movie) {
      throw new RpcException({
        message: `Movie with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }
    return movie;
  }

  async update(id: number, updatePeliculaDto: UpdatePeliculaDto) {
    await this.findOne(id);
    const {id:__, ...data} = updatePeliculaDto;
    const movie = await this.movie.update({
      where:{id}, 
      data:data
    });
    return movie;
  }

  async remove(id: number) {
    await this.findOne(id);
    const movie = await this.movie.update({
      where: {id},  
      data: {available: false}
    });
    return movie;
  }
}
