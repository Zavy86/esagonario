import {GameResponseType} from "@shared/types";
import {GameModel, RecordModel} from "../models";

export class GameResponse implements GameResponseType{
	constructor(
		public Game:GameModel,
		public Records:RecordModel[]
	){}
}
