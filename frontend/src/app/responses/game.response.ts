import {GameResponseType, GameType, RecordType} from "@shared/types";

export class GameResponse implements GameResponseType{
	constructor(
		public Game:GameType,
		public Records:RecordType[]
	){}
}
