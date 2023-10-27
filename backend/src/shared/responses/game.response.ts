import {GameModel, RecordModel} from "../models";

export class GameResponse {

	constructor(
		public Game:GameModel,
		public Records:RecordModel[]
	){}

}
