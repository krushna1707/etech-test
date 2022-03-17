import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppService } from 'src/app.service';
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/list')
    list(@Query() query: {limit:number, last: number}) {
        try{
            let limit = query.limit ? query.limit : 10;
            let total = query.last ? query.last : 0;
            limit =  parseInt(total.toString()) + parseInt(limit.toString())
            let products = this.productService.loadJson()
            return {
                statusCode: 200,
                message: "Item retrieved successfully",
                data: {
                    last: limit,
                    products: products.slice(total, limit)
                }
            };
        } catch(error){
            throw new BadRequestException(error)
        }       
    }

    @Post('/add')
    @UseInterceptors(FileInterceptor('itemImage'))
    add(@UploadedFile() itemImage: Express.Multer.File, @Body() body: ProductDto) {
        if(itemImage){            
            try{
                const product = this.productService.add(body, itemImage)
                return {
                    statusCode: 200,
                    message: "Item added successfully",
                    data: product
                };
            } catch(error){
                return {status: false, message: error}
            }           
        } else {
            throw new BadRequestException("Please select item image")
        }       
    }

    @Put('/update/:id')
    @UseInterceptors(FileInterceptor('itemImage'))
    upload(@UploadedFile() itemImage: Express.Multer.File, @Body() body: ProductDto, @Param('id') id: string) {     
        try{
            const product = this.productService.update(body, id, itemImage)
            return {
                statusCode: 200,
                message: "Item updated successfully",
                data: product
            };
        } catch(error){
            throw new BadRequestException(error)
        }
    }

    @Delete('/delete/:id')
    delete(@Param('id') id: string){
        try{
            const product = this.productService.delete(id)
            return {
                statusCode: 200,
                message: "Item deleted successfully",
                data: product
            };
        } catch(error){
            throw new BadRequestException(error)
        }
    }

}
