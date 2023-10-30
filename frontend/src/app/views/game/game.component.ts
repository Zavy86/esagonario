import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LogsService} from "src/app/services/logs.service";
import {BackendService} from "src/app/services/backend.service";
import {AlertsService, AlertTypologies} from "src/app/services/alerts.service";
import {Subscription} from "rxjs";
import {GameModel, RecordModel} from "@shared/models";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit, OnDestroy {

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private logsService:LogsService,
    private alertsService:AlertsService,
    private backendService:BackendService
  ){}

  private _subscription:Subscription = new Subscription();

  isReady:boolean = false;

  uid:string = 'latest';
  Game:GameModel|undefined;
  Records:RecordModel[] = [];


  ngOnInit():void {
    this.logsService.log('game component init');
    this.uid = this.route.snapshot.paramMap.get('uid') as string;
    this.logsService.log('game:',this.uid);
    // check for game uid
    if(this.uid==='latest' || this.uid.length==10) {
      this.getGame(this.uid);
    } else {
      this.logsService.error('game length must be in format YYYY-MM-DD');
      this.alertsService.add('Error invalid Game',AlertTypologies.Danger);
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy():void {
    this._subscription.unsubscribe();
  }

  private getGame(game:string):void {
    this._subscription = this.backendService.getGame(game).subscribe({
      next: (gameResponse) => {
        this.Game = gameResponse.Game;
        this.Records = gameResponse.Records;
        this.isReady = true;
      },
      error: (error) => {
        this.logsService.error('error retrieving game '+this.uid, error);
        this.alertsService.add('Error retrieving game.', AlertTypologies.Danger);
        this.router.navigate(['/']);
      }
    });
  }

}
