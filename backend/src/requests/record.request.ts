import {RecordRequestType} from "@shared/types";
import {IsString, IsNotEmpty, IsArray, ArrayMinSize} from "class-validator";

export class RecordRequest implements RecordRequestType {

	@IsString()
	@IsNotEmpty()
	uuid:string = '';

	@IsString()
	@IsNotEmpty()
	nickname:string = '';

	@IsArray()
	@ArrayMinSize(1)
	@IsString({each: true})
	words:string[] = [];

}
