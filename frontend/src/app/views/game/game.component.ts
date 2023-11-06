import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LogsService} from "src/app/services/logs.service";
import {BackendService} from "src/app/services/backend.service";
import {AlertsService, AlertTypologies} from "src/app/services/alerts.service";
import {Subscription} from "rxjs";
import {GameModel, RecordModel} from "@shared/models";
import {InputComponent} from "src/app/views/game/input/input.component";

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
    private backendService:BackendService
  ){}

  private _subscription:Subscription = new Subscription();

  isReady:boolean = false;

  uid:string = 'latest';
  Game:GameModel|undefined;
  Records:RecordModel[] = [];

	progress:number = 0;
	discoveredWords:string[] = [];
	currentWord:string = '';
	inputClass:string = '';

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
		} else if(this.checkWord(this.currentWord)){
			console.log('aggiunto: ',this.currentWord)
			this.setTemporaryClassAndClear('success');
			this.discoveredWords = [...this.discoveredWords,this.currentWord];
			this.progress = (this.discoveredWords.length / (this.Game?.words.length ?? 0) * 100)
			if(this.progress == 100){
				alert('Finish!');
			}
		}else{
			this.setTemporaryClassAndClear('error');
		}
  }

	private checkWord(word:string):boolean{
		return (this.Game?.words.includes(word)) ?? false;
	}

	private setTemporaryClassAndClear(inputClass:string):void{
		this.inputClass = inputClass;
		setTimeout(() => {
			this.currentWord = '';
			this.inputClass = '';
		},900);
	}

}
