import * as fs from 'fs';
import * as letters from "src/assets/letters.json";
import * as words from "src/assets/words.json";
import {BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import {GameModel, RecordModel} from "./models/";
import {RecordResponse, GameResponse} from "./responses";
import {RecordRequest} from "./requests";

@Injectable()
export class AppService {

  private readonly logger:Logger = new Logger(AppService.name);
  private readonly availableLetters:string[] = letters;
  private readonly availableWords:string[] = words;

  getGame(date:string|undefined = undefined,records:boolean = false):GameResponse{

    const today = new Date(new Date().setUTCHours(0,0,0,0)).toISOString().split('T')[0];

    // @todo check date format yyyy-mm-dd

    if(!date){date = today;}
    if(date > today){throw new BadRequestException('This game is not ready yet');}

    const Game:GameModel = (this.gameExists(date) ? this.loadGame(date) : this.newGame(date));
    const Records:RecordModel[] = (records ? this.loadRecords(date) : []);

    const response:GameResponse = new GameResponse(Game,Records);
    //console.log(response)
    return response;
  }

  private gameExists(date:string):boolean{
    return fs.existsSync('../datasets/'+date+'.json');
  }

  private recordsExists(date:string):boolean{
    return fs.existsSync('../datasets/'+date+'-records.json');
  }

  private loadGame(date:string):GameModel {
    try{
      const encoded:string = fs.readFileSync('../datasets/'+date+'.json',{ encoding: 'utf8', flag: 'r' });
      const decoded:GameModel = JSON.parse(encoded);
      //console.log(decoded);
      const gameModel:GameModel = new GameModel();
      gameModel.date = decoded.date;
      gameModel.points = decoded.points;
      gameModel.letters = decoded.letters;
      gameModel.words = decoded.words;
      this.logger.log('Game loaded: ' + date);
      return gameModel;
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException('error reading game file');
    }
  }

  private loadRecords(date:string):RecordModel[] {
    if(!this.recordsExists(date)){return [];}
    try{
      const encoded:string = fs.readFileSync('../datasets/'+date+'-records.json',{ encoding: 'utf8', flag: 'r' });
      const decoded:RecordModel[] = JSON.parse(encoded);
      //console.log(decoded);
      const records:RecordModel[] = [];
      decoded.forEach((record:RecordModel):void => {
        const recordModel:RecordModel = new RecordModel();
        recordModel.nickname = record.nickname;
        recordModel.points = record.points;
        recordModel.words = record.words;
        records.push(record);
      });
      return records;
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException('error reading record file');
    }
  }

  private newGame(date:string):GameModel {
    let selectedLetters:string[] = [];
    let compatibleWords:string[] = [];
    do{
      selectedLetters = this.selectLetters();
      compatibleWords = this.checkWords(selectedLetters);
    }while(compatibleWords.length<20);
    while(compatibleWords.length>20){
      compatibleWords.splice(Math.floor(Math.random() * compatibleWords.length),1);
    }
    const gameModel:GameModel = new GameModel();
    gameModel.date = date;
    gameModel.letters = selectedLetters;
    gameModel.words = compatibleWords;
    gameModel.points = this.calculatePoints(compatibleWords);
    try{
      fs.writeFileSync('../datasets/'+date+'.json',JSON.stringify(gameModel,null,2));
      this.logger.log('Game created: ' + date);
      return gameModel;
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException('error writing game file');
    }
  }

  private selectLetters():string[] {
    const selectedLetters:string[] = [];
    do{
      const letter = this.availableLetters[Math.floor(Math.random() * this.availableLetters.length)];
      if(!selectedLetters.includes(letter)){selectedLetters.push(letter);}
    }while(selectedLetters.length<7);
    return selectedLetters;
  }

  private checkWords(selectedLetters:string[]):string[] {
    const compatibleWords:string[] = [];
    this.availableWords.forEach((word:string):void => {
      if(this.checkWord(word,selectedLetters)){compatibleWords.push(word);}
    });
    return compatibleWords;
  }

  private checkWord(word:string,selectedLetters:string[]):boolean {
    if(!word.includes(selectedLetters[0])){return false;}
    for(let index:number = 0,letter:string = '';letter = word.charAt(index);index++){
      if(!selectedLetters.includes(letter)){return false;}
    }
    return true;
  }

  public storeRecord(date:string, store:RecordRequest):RecordResponse {
    if(!this.gameExists(date)){throw new NotFoundException('no game found for '+date);}
    const gameModel:GameModel = this.loadGame(date);
    const records:RecordModel[] = this.loadRecords(date);
    let recordModel:RecordModel|undefined = records.find((record:RecordModel):boolean => record.uuid === store.uuid);
    let newRecord:boolean = false;
    if(!recordModel) {
      newRecord = true;
      recordModel = new RecordModel()
      recordModel.uuid = store.uuid;
    }
    //console.log(store)
    recordModel.nickname = store.nickname;
    recordModel.timestamp = new Date().getTime();
    recordModel.words = this.checkDiscoveredWords(store.words,gameModel.words);
    recordModel.points = this.calculatePoints(recordModel.words);
    if(newRecord){records.push(recordModel);}
    records.sort(this.sortByPointAndTimestamp);
    try{
      fs.writeFileSync('../datasets/'+date+'-records.json',JSON.stringify(records,null,2));
      this.logger.log('Record saved: ' + recordModel.uuid);
      return new RecordResponse(records);
    }catch(err){
      this.logger.error(err);
      throw new InternalServerErrorException('error writing records file');
    }
  }

  private sortByPointAndTimestamp(a:RecordModel,b:RecordModel):number{
    if(a.points > b.points){ return -1; }
    else if(b.points > a.points){ return 1; }
    else if(a.timestamp < b.timestamp){ return -1; }
    else if(b.timestamp > a.timestamp){ return -1; }
    else{ return 0; }
  }

  private checkDiscoveredWords(discoveredWords:string[],compatibleWords:string[]):string[] {
    const correctWords:string[] = [];
    discoveredWords.forEach((word:string):void => {
      if(compatibleWords.includes(word)){
        correctWords.push(word);
      }
    });
    return correctWords;
  }

  private calculatePoints(words:string[]):number {
    let points:number = 0;
    words.forEach((word:string):void => {
      points += this.calculatePoint(word);
    });
    return points;
  }

  /**
   * Calculate word points
   * Vocals = 1 point
   * Consonants = 2 points
   * Letter point multiplied for word length
   *
   * @param word
   * @private
   */
  private calculatePoint(word:string):number {
    let points:number = 0;
    for(let index:number = 0,letter:string = '';letter = word.charAt(index);index++){
      if(['A','E','I','O','U'].includes(letter)){points += 1;}else{points += 2;}
    }
    points *= word.length;
    return points;
  }

}
