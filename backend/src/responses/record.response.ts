import {RecordResponseType} from "@shared/types";
import {RecordModel} from "../models";

export class RecordResponse implements RecordResponseType{

	constructor(
		public Records:RecordModel[]
	){}

}
