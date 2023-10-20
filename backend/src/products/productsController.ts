import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ProductsService} from "src/products/products.service";
import {ProductModel} from "src/models/Product.model";

@Controller('Products')
export class ProductsController {

	constructor(
		private readonly productsService:ProductsService
	){}

	@Get()
	browse():ProductModel[]{
		return this.productsService.browse();
	}

	@Get(':code')
	retrieve(
		@Param('code') code:string
	):ProductModel{
		return this.productsService.retrieve(code);
	}

	@Post()
	create(
		@Body('code') code:string,
		@Body('label') label:string,
		@Body('price') price:number
	):any {
		const result:boolean = this.productsService.create(code,label,price);
		return { result: result };
	}

	@Patch(':code')
	update(
		@Param('code') code:string,
		@Body('label') label:string,
		@Body('price') price:number
	):any {
		const result:boolean = this.productsService.update(code,label,price);
		return { result: result };
	}

	@Delete(':code')
	remove(
		@Param('code') code:string
	):boolean{
		return this.productsService.remove(code);
	}

}
