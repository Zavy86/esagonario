import {GameType} from "@shared/types";

export class GameModel implements GameType {
	public date:string = 'latest';
	public points:number = 0;
	public letters:string[] = [];
	public words:string[] = [];
}
