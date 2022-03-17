import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ProductDto {

    @IsString()
    @IsNotEmpty()
    itemName: string;
  
    @Type(()=> Number)
    @IsNumber()
    @Min(1) 
    @Max(99999.99)
    @IsNotEmpty()
    itemPrice: Number;

  }