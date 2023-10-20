import {Injectable, NotFoundException} from '@nestjs/common';
import {ProductModel} from "src/models/Product.model";

@Injectable()
export class ProductsService {

	Products:ProductModel[] = [];

	private findProduct(code:string):[number,ProductModel]{
		const index = this.Products.findIndex((Product)=>Product.code==code);
		const Product:ProductModel = this.Products[index];
		if(!Product){throw new NotFoundException();}
		return [index,Product]
	}

	browse():ProductModel[] {
		return [...this.Products]; // [...] per non passare l'array vero ma una copia
	}

	retrieve(code:string):ProductModel {
		const [index,Product]:[number,ProductModel] = this.findProduct(code);
		return {...Product}; // [...] per non passare l'oggetto vero ma una copia
	}

	//addProduct(product:Product) {
	create(code:string,label:string,price:number):boolean {
		if(!code.length || !label.length || !price){return false;} // @todo checks
		const Product:ProductModel = new ProductModel(code,label,price);
		this.Products.push(Product);
		return true;
	}

	update(code:string,label:string,price:number):boolean {
		const [index,Product]:[number,ProductModel] = this.findProduct(code);
		const updatedProduct:ProductModel = {...Product};
		if(label){updatedProduct.label = label;}
		if(price){updatedProduct.price = price;}
		this.Products[index] = updatedProduct;
		return true;
	}

	remove(code:string):boolean {
		const [index,Product]:[number,ProductModel] = this.findProduct(code);
		this.Products.splice(index,1);
		return true;
	}

}
