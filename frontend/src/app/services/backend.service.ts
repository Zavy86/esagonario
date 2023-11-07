import {ENV} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {AlertsService, AlertTypologies, LogsService} from "src/app/services";
import {GameResponse} from "src/app/responses";
import {RecordResponse} from "src/app/responses";
import {RecordRequest} from "src/app/requests";

@Injectable({
  providedIn: 'root'
})

export class BackendService {

  private options = {
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  };

  constructor(
    protected httpClient:HttpClient,
    protected logsService:LogsService,
    protected alertsService:AlertsService
  ){}


  public getGame(game:string):Observable<GameResponse>{
    return this.GET(
      ENV.backend+'/'+game
    ).pipe(
      map((response) => new GameResponse(response.Game,response.Records)),
      tap((response) => this.logsService.log('HTTP GET /'+game+' response',response))
    );
  }

  public storeRecord(game:string,storeRecordRequest:RecordRequest):Observable<RecordResponse>{
    return this.POST(
      ENV.backend+'/'+game,
      storeRecordRequest
    ).pipe(
      map((response) => new RecordResponse(response.Records)),
      tap((response) => this.logsService.log('HTTP POST /'+game+' response',response))
    );
  }

  private GET(uri:string):Observable<any> {
    this.logsService.log('try to make http get...');
    return this.httpClient.get<any>(uri,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private POST(uri:string,request:any|null=null):Observable<any> {
    this.logsService.log('try to make http post...');
    return this.httpClient.post<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private PATCH(uri:string,request:any):Observable<any> {
    this.logsService.log('try to make http patch...');
    return this.httpClient.patch<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private PUT(uri:string,request:any):Observable<any> {
    this.logsService.log('try to make http put...');
    return this.httpClient.put<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private DELETE(uri:string):Observable<any> {
    this.logsService.log('try to make http delete...');
    return this.httpClient.delete<any>(uri,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private processError(err:any):any {
    this.logsService.error('error executing http request',err)
    if(ENV.debug){this.alertsService.add(err.message, AlertTypologies.Danger, 'Error: ' + err.name);}
    this.processResponse(err.error);
    return throwError(err);
  }

  private processResponse(res:any):any {
    this.logsService.log('http executed response:', res);
    try{
      let response = res;
      //let response = new Response(res);
			//this.logsService.log("http response parsed", response);
			return response;
		}catch(err){
      this.logsService.warn(err);
      return new Observable<false>;
    }
  }

}
