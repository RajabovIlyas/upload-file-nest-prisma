import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_NOT_FOUND } from '../../common/constants';
import { join } from 'path';
import { of } from 'rxjs';
import { UploadFileDto } from './dtos/upload-file.dto';
import { saveFileToStorage } from './helpers/upload-file.helper';
import { PaginationQueryDto } from './dtos/pagination-query.dto';
import { transformFileDataForStorage } from "./helpers/transform-file-data.helper";

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveFileToStorage))
  upload(@UploadedFile() uploadFileDto: UploadFileDto) {


    console.log(uploadFileDto);
    return this.filesService.create(transformFileDataForStorage(uploadFileDto));
  }

  @Get('list')
  getList(@Query() query: PaginationQueryDto) {
    const { page, limit } = query;

    return this.filesService.findWithPagination(page, limit);
  }

  @Delete('delete/:id')
  deleteById(@Param('id') id: string) {
    return this.filesService.deleteById({ id });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.filesService.findOne({ id });
  }

  @Get('download/:id')
  async getFileById(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findOne({ id });
    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND);
    }
    return of(res.sendFile(join(process.cwd(), file.path)));
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file', saveFileToStorage))
  async updateFileById(
    @UploadedFile() uploadFileDto: UploadFileDto,
    @Param('id') id: string,
  ) {
    await this.filesService.updateAndDeleteOldFile(id, transformFileDataForStorage(uploadFileDto));
    return { message: 'File changed successfully!', code: HttpStatus.OK };
  }
}
