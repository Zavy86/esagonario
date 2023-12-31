import {ENV} from "src/environments/environment";
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameType, RecordType} from "@shared/types";
import {Subscription} from "rxjs";
import {AlertsService, AlertTypologies, BackendService, LogsService, SessionService} from "src/app/services";
import {InputComponent} from "src/app/views/game/input/input.component";
import {GameResponse} from "src/app/responses";
import {RecordRequest} from "src/app/requests";
import {RecordResponse} from "src/app/responses";
import {TooltipStrDirective} from "ngx-tooltip-directives";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

	@ViewChild('inputComponent') inputComponent!:InputComponent;

	@ViewChild('help_00') help_00!:TooltipStrDirective;
	@ViewChild('help_01') help_01!:TooltipStrDirective;
	@ViewChild('help_02') help_02!:TooltipStrDirective;
	@ViewChild('help_03') help_03!:TooltipStrDirective;
	@ViewChild('help_04') help_04!:TooltipStrDirective;
	@ViewChild('help_05') help_05!:TooltipStrDirective;
	@ViewChild('help_06') help_06!:TooltipStrDirective;
	@ViewChild('help_07') help_07!:TooltipStrDirective;

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
  Game:GameType|undefined;
  Records:RecordType[] = [];

	rank:number = 0;
	points:number = 0;
	progress:number = 0;
	suggestions:string[] = [];
	discoveredWords:string[] = [];
	currentWord:string = '';
	inputClass:string = '';
	completed:boolean = false;

	currentHelpTooltip:number = 0;
	helpTooltips:TooltipStrDirective[] = [];

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
				this.suggestions = [...gameResponse.Game.letters[0]];
        this.isReady = true;
				this.loadMyRecord();
				if(game == 'latest'){
					this.getGame(gameResponse.Game.date);
					if(this.sessionService.showHelpTooltips()) {
						this.showHelpTooltips();
					}
				}
				setInterval(():void => {
					this.logsService.info('refresh game data');
					this.getGame(gameResponse.Game.date);
				},60*1000);
      },
      error:(error):void => {
        this.logsService.error('error retrieving game '+this.uid, error);
        this.alertsService.add('Error retrieving game.', AlertTypologies.Danger);
				if(game != 'latest'){ window.location.href = '/'; }
      }
    });
  }

	private loadMyRecord():void {
		let record:RecordType|undefined = this.Records.find((record:RecordType) => record.uuid == this.sessionService.uuid);
		if(record){
			this.points = record.points;
			this.discoveredWords = [...record.words];
			this.setSuggestions();
			this.calculateProgress();
			this.calculateRank();
		}
	}

	storeRecord():void {
		const date:string = this.Game?.date as string;
		const record:RecordRequest = new RecordRequest();
		record.uuid = this.sessionService.uuid;
		record.nickname = this.sessionService.nickname;
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
    //this.logsService.log(letter);
  }

  deleteLetter():void {
    if(this.currentWord.length) {
      this.currentWord = this.currentWord.slice(0, -1)
    }
  }

  submitWord():void {
		if(this.completed){ return; }
		if(this.discoveredWords.includes(this.currentWord)){
			this.setTemporaryClassAndClear('warning');
			this.playSound('warning');
		}else if(this.checkWord(this.currentWord)){
			this.logsService.log('discovered: ',this.currentWord)
			this.setTemporaryClassAndClear('success');
			this.discoveredWords = [...this.discoveredWords,this.currentWord];
			this.setSuggestions();
			this.calculateProgress();
			this.storeRecord();
			if(this.discoveredWords.length == this.Game?.words.length){
				this.playSound('finish');
			}else{
				this.playSound('success');
			}
		}else{
			this.setTemporaryClassAndClear('error');
			this.playSound('error');
		}
  }

	private checkWord(word:string):boolean{
		return (this.Game?.words.includes(word)) ?? false;
	}

	private setSuggestions():void {
		if(!this.Game){ return; }
		this.suggestions = [...this.Game.letters[0]];
		if(this.discoveredWords.length >= 3){
			this.suggestions.push(this.Game.letters[6]);
		}
		if(this.discoveredWords.length >= 9){
			this.suggestions.push(this.Game.letters[2]);
		}
		if(this.discoveredWords.length >= 18){
			this.suggestions.push(this.Game.letters[4]);
		}
	}

	private calculateProgress():void {
		this.progress = 0;
		if(!this.Game) { return; }
		this.progress = ( this.points * 100 / this.Game.points );
		this.completed = ( this.discoveredWords.length == this.Game.words.length );
	}

	private calculateRank():void {
		this.rank = (this.Records.findIndex((record:RecordType):boolean => record.uuid == this.sessionService.uuid) + 1);
	}

	private setTemporaryClassAndClear(inputClass:string):void{
		this.inputClass = inputClass;
		setTimeout(() => {
			this.currentWord = '';
			this.inputClass = '';
		},900);
	}

	private playSound(sound:string):void {
		let audio:HTMLAudioElement = new Audio();
		audio.src = 'assets/' + sound + '.flac';
		audio.load();
		audio.play();
	}

	changeNickname(nickname:string):void {
		this.sessionService.changeNickname(nickname);
	}

	tooltipEvent(event:{type:string,position:DOMRect}):void {
		if(event.type == 'hide'){this.showHelpTooltip();}
	}

	showHelpTooltips():void{
		this.currentHelpTooltip = 0;
		this.showHelpTooltip();
	}

	private showHelpTooltip():void{
		if(!this.helpTooltips.length){
			this.loadHelpTooltips();
		}
		if(this.currentHelpTooltip in this.helpTooltips) {
			this.helpTooltips[this.currentHelpTooltip].show();
			this.currentHelpTooltip++;
		} else {
			let response:boolean = confirm('Vuoi mostrare questi suggerimenti al prossimo accesso?');
			this.sessionService.setHelpTooltips(response);
		}
	}

	private loadHelpTooltips():void{
		this.helpTooltips.push(
			this.help_00,
			this.help_01,
			this.help_02,
			this.help_03,
			this.help_04,
			this.help_05,
			this.help_06,
			this.help_07
		);
	}

}
