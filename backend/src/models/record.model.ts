import {RecordType} from "@shared/types";

export class RecordModel implements RecordType{
	uuid:string = '';
	nickname:string = '';
	words:string[] = [];
	points:number = 0;
	timestamp:number = 0;
}
