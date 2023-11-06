import {ENV} from "../../environments/environment";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LogsService} from "../services/logs.service";
import {AlertsService, AlertTypologies} from "../services/alerts.service";
import {GameResponse, RecordResponse} from "@shared/responses";
import {StoreRecordRequest} from "@shared/requests";

@Injectable({
  providedIn: 'root'
})

export class BackendService {

	private uuid:string;

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
  ){
		this.uuid = localStorage.getItem('uuid') ?? (Math.random().toString(36).substring(2,11) + Math.random().toString(36).substring(2,11));
		localStorage.setItem('uuid',this.uuid);
		console.log('uuid',this.uuid);
	}


  public getGame(game:string):Observable<GameResponse>{
    return this.GET(
      ENV.backend+'/'+game
    ).pipe(
      map((response) => new GameResponse(response.Game,response.Records)),
      tap((response) => this.logsService.log('HTTP GET /'+game+' response',response))
    );
  }

  public storeRecord(game:string,storeRecordRequest:StoreRecordRequest):Observable<RecordResponse>{
    return this.POST(
      ENV.backend+'/'+game,
      storeRecordRequest
    ).pipe(
      map((response) => new RecordResponse(response.Record)),
      tap((response) => this.logsService.log('HTTP POST /'+game+' response',response))
    );
  }

  private GET(uri:string):Observable<any> {
    //this.logService.log('try to make http get...');
    return this.httpClient.get<any>(uri,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private POST(uri:string,request:any|null=null):Observable<any> {
    //this.logService.log('try to make http post...');
    return this.httpClient.post<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private PATCH(uri:string,request:any):Observable<any> {
    //this.logsService.log('try to make http patch...');
    return this.httpClient.patch<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private PUT(uri:string,request:any):Observable<any> {
    //this.logsService.log('try to make http put...');
    return this.httpClient.put<any>(uri,request,this.options).pipe(
      catchError(error => this.processError(error)),
      map(response => this.processResponse(response))
    );
  }

  private DELETE(uri:string):Observable<any> {
    //this.logService.log('try to make http delete...');
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

  private processResponse(res:any,responseObject:string=''):any {
    this.logsService.log('http raw response:',res);
    try{
      let response = res;
      /*let response=new Response(res);
      if(response.error){
        this.logsService.error('error in response',response.errors)
        if(ENV.debug){response.errors.forEach(error=>this.alertsService.add(error.description+' : '+error.information,AlertTypologies.Danger,'Error: ' + error.code));}
        return new Observable<false>;
      }if(responseObject!='' && responseObject!=response.object){
        this.logsService.error('response.responseObject check error not '+responseObject);
        if(ENV.debug){this.alertsService.add('response.responseObject check error not '+responseObject)}
        return new Observable<false>;
      }else{*/
        this.logsService.log("http response successfully parsed");
        return response;
      //}
    }catch(err){
      //this.logService.warn(err);
      return new Observable<false>;
    }
  }

}
