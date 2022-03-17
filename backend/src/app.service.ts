import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  uploadImageFile(file, fileName){
    try{
      if(file.mimetype.indexOf('image') == -1){
        throw 'Only allow jpg, png and jpeg formate';
      }
      const mimetype = file.mimetype.split('/')[1];
      const basePath = `/product/${fileName}.${mimetype}`
      writeFileSync(`./public${basePath}`, file.buffer)
      return basePath;
    } catch(error){
      throw 'Could not upload image';
    }
  }
}
