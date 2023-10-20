import {Module} from '@nestjs/common';
import {ProductsController} from "src/products/productsController";
import {ProductsService} from "src/products/products.service";

@Module({
	controllers: [
		ProductsController
	],
	providers: [
		ProductsService
	]
})
export class ProductsModule {}
