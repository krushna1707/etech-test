import { Module } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService,AppService]
})
export class ProductModule {}
