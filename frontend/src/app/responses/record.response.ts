import {RecordResponseType, RecordType} from "@shared/types";

export class RecordResponse implements RecordResponseType{

	constructor(
		public Records:RecordType[]
	){}

}
