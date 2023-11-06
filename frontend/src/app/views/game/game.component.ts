import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LogsService} from "src/app/services/logs.service";
import {BackendService} from "src/app/services/backend.service";
import {AlertsService, AlertTypologies} from "src/app/services/alerts.service";
import {Subscription} from "rxjs";
import {GameModel, RecordModel} from "@shared/models";
import {InputComponent} from "src/app/views/game/input/input.component";
import {StoreRecordRequest} from "@shared/requests";
import {ENV} from "src/environments/environment";
import {SessionService} from "src/app/services/session.service";
import {GameResponse, RecordResponse} from "@shared/responses";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

	@ViewChild(InputComponent) inputComponent:InputComponent | undefined;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private logsService:LogsService,
    private alertsService:AlertsService,
    private sessionService:SessionService,
    private backendService:BackendService
  ){}

  private _subscription:Subscription = new Subscription();

	debug:boolean = false;
  isReady:boolean = false;

  uid:string = 'latest';
  Game:GameModel|undefined;
  Records:RecordModel[] = [];

	rank:number = 0;
	points:number = 0;
	progress:number = 0;
	discoveredWords:string[] = [];
	currentWord:string = '';
	inputClass:string = '';

  ngOnInit():void {
		this.debug = ENV.debug;
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
      next:(gameResponse:GameResponse):void => {
        this.Game = gameResponse.Game;
        this.Records = gameResponse.Records;
        this.isReady = true;
				this.loadMyRecord();
				if(game == 'latest'){ this.getGame(gameResponse.Game.date); }
      },
      error:(error):void => {
        this.logsService.error('error retrieving game '+this.uid, error);
        this.alertsService.add('Error retrieving game.', AlertTypologies.Danger);
				window.location.href = '/';
      }
    });
  }

	private loadMyRecord():void {
		let record:RecordModel|undefined = this.Records.find((record:RecordModel) => record.uuid = this.sessionService.uuid);
		if(record){
			this.points = record.points;
			this.discoveredWords = [...record.words];
			this.calculateProgress();
			this.calculateRank();
		}
	}

	storeRecord():void {
		const date:string = this.Game?.date as string;
		const record:StoreRecordRequest = new StoreRecordRequest();
		record.uuid = this.sessionService.uuid;
		record.nickname = localStorage.getItem('nickname') as string;
		record.words = [...this.discoveredWords];
		this._subscription = this.backendService.storeRecord(date, record).subscribe({
			next:(recordResponse:RecordResponse):void => {
				this.Records = recordResponse.Records;
				this.loadMyRecord();
			},
			error:(error):void => {
				this.logsService.error('error storing record', error);
				this.alertsService.add('Error storing record.', AlertTypologies.Danger);
				window.location.href = '/';
			}
		});
	}

  letterSelected(letter:string):void {
    this.currentWord += letter;
    console.log(letter);
  }

  deleteLetter():void {
    if(this.currentWord.length) {
      this.currentWord = this.currentWord.slice(0, -1)
    }
  }

  submitWord():void {
		if(this.discoveredWords.includes(this.currentWord)){
			this.setTemporaryClassAndClear('warning');
		}else if(this.checkWord(this.currentWord)){
			console.log('aggiunto: ',this.currentWord)
			this.setTemporaryClassAndClear('success');
			this.discoveredWords = [...this.discoveredWords,this.currentWord];
			this.calculateProgress();
			if(this.progress == 100){
				alert('Finish!');
			}
			this.storeRecord();
		}else{
			this.setTemporaryClassAndClear('error');
		}
  }

	private checkWord(word:string):boolean{
		return (this.Game?.words.includes(word)) ?? false;
	}

	private calculateProgress():void {
		this.progress = (this.discoveredWords.length / (this.Game?.words.length ?? 0) * 100);
	}

	private calculateRank():void {
		this.rank = (this.Records.findIndex((record:RecordModel) => record.uuid = this.sessionService.uuid) + 1);
	}

	private setTemporaryClassAndClear(inputClass:string):void{
		this.inputClass = inputClass;
		setTimeout(() => {
			this.currentWord = '';
			this.inputClass = '';
		},900);
	}

	changeNickname(nickname:string):void {
		this.sessionService.changeNickname(nickname);
	}

}
