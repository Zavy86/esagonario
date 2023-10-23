import {IsString, IsNotEmpty, IsArray, ArrayMinSize} from "class-validator";

export class StoreRecordRequest {

	@IsString()
	@IsNotEmpty()
	nickname:string;

	@IsArray()
	@ArrayMinSize(1)
	@IsString({each: true})
	words:string[];

}
