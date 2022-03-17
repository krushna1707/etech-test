import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { AppService } from 'src/app.service';
import { ProductDto } from './product.dto';
@Injectable()
export class ProductService {
    constructor(private appService: AppService) { }
    loadJson() {
        try {
            const data: any = readFileSync('./product.json');
            if (data == '') {
                return [];
            } else {
                return JSON.parse(data);
            }
        } catch (error) {
            throw "Could not load json";
        }
    }

    writeJson(products) {
        try {
            return writeFileSync('./product.json', JSON.stringify(products));
        } catch (error) {
            throw "Error while item add";
        }
    }

    add(data: ProductDto, itemImageFile) {        
        let product = this.loadJson();
        if (product.filter(row => row.itemName.toLowerCase() == data.itemName.toLowerCase()).length) {
            throw "Item already exists";
        } else {
            const itemImage = this.appService.uploadImageFile(itemImageFile, `${data.itemName.replace('', '_')}_${new Date().getTime()}`);
            product.push(Object.assign(data, {itemId: randomUUID(), itemImage}));
            this.writeJson(product);
            return data;
        }
    }

    update(data: ProductDto, id: string, itemImageFile) {
        let product = this.loadJson();
        const index = product.findIndex(row => row.itemId == id);
        if (index == -1) {
            throw "Item not found";
        } else if (product.filter(row => row.itemId !== id && row.itemName.toLowerCase() == data.itemName.toLowerCase()).length) {
            throw "Item already exists";
        } else {
            let itemImage = product[index].itemImage
            if(itemImageFile){
                itemImage = this.appService.uploadImageFile(itemImageFile, `${data.itemName.replace('', '_')}${new Date().getTime()}`);
                unlinkSync('./public'+ product[index].itemImage);
            }            
            product[index] = Object.assign(product[index], {itemName: data.itemName, itemPrice: data.itemPrice, itemImage})
            this.writeJson(product);
            return product[index];
        }
    }

    delete(id: string) {
        let product = this.loadJson();
        const index = product.findIndex(row => row.itemId == id);
        console.log(index)
        if (index == -1) {
            throw "Item not found";
        } else {
            const unlinkImagePath = './public'+ product[index].itemImage
            product.splice(index, 1);        
            unlinkSync(unlinkImagePath);
            this.writeJson(product);
            return true;
        }
    }
}
