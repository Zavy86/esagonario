import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {GameResponse, RecordResponse} from "@shared/responses";
import {StoreRecordRequest} from "src/requests";

@Controller()
export class AppController {

  constructor(
    private readonly appService:AppService
  ){}

  @Get()
  getWelcome():string {
    return "Welcome! insert links to api calls";
  }

  @Get('latest')
  getLatest():GameResponse {
    return this.appService.getGame();
  }

  @Get(':date')
  getGame(
    @Param('date') date:string,
  ):GameResponse {
    return this.appService.getGame(date,true);
  }

  @Post(':date')
  storeResult(
    @Param('date') date:string,
    @Body() store:StoreRecordRequest,
  ):RecordResponse {
    return this.appService.storeRecord(date,store);
  }

}
