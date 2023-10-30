import {Injectable} from '@angular/core';
import {ENV} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  debug:boolean;

  constructor(){this.debug=ENV.debug;}

  log(...data:any[]):void{if(this.debug){console.log(...data);}}
  info(...data:any[]):void{if(this.debug){console.info(...data);}}
  warn(...data:any[]):void{if(this.debug){console.warn(...data);}}
  error(...data:any[]):void{if(this.debug){console.error(...data);}}

}
