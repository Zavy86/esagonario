import {RecordRequestType} from "@shared/types";

export class RecordRequest implements RecordRequestType {
	uuid:string = '';
	nickname:string = '';
	words:string[] = [];
}
