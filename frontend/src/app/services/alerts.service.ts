import {Injectable} from '@angular/core';

export interface AlertInterface {
  header:string;
  body:string;
  classes:string;
  delay?:number;
}

export class Alert implements AlertInterface{
  header:string;
  body:string;
  classes:string;
  delay?:number;
  constructor(alert:AlertInterface){
    this.header=alert.header;
    this.body=alert.body;
    this.classes=alert.classes;
    this.delay=alert.delay;
  }
}

export enum AlertTypologies{
  Default,
  Information,
  Success,
  Warning,
  Danger
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  public alerts:Alert[] = [];

  constructor(){
    //this.add('information',AlertTypologies.Information);
    // this.add('information',AlertTypologies.Information,'head');
    // this.add('warning',AlertTypologies.Warning);
    // this.add('warning',AlertTypologies.Warning,'head');
    // this.add('success',AlertTypologies.Success);
    // this.add('success',AlertTypologies.Success,'head');
    // this.add('danger',AlertTypologies.Danger);
    // this.add('danger',AlertTypologies.Danger,'head');
    // this.add('default',AlertTypologies.Default);
    // this.add('default',AlertTypologies.Default,'head');
  }

  public add(body:string,typology:AlertTypologies=AlertTypologies.Default,header:string='',delay?:number){
    let classes='';
    switch(typology){
      case AlertTypologies.Information:
        classes='bg-primary text-light';
        break;
      case AlertTypologies.Success:
        classes='bg-success text-light';
        break;
      case AlertTypologies.Warning:
        classes='bg-warning text-light';
        break;
      case AlertTypologies.Danger:
        classes='bg-danger text-light';
        break;
    }
    this.alerts.push(new Alert({body,header,classes,delay}));
  }

  public remove(alert:AlertInterface){
    this.alerts = this.alerts.filter(item => item != alert);
  }

}
