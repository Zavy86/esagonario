import {GameModel, RecordModel} from "src/models";

export class GameResponse {

	constructor(
		public Game:GameModel,
		public Records:RecordModel[]
	){}

}
