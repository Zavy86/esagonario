import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss']
})
export class WordsComponent implements OnInit, OnChanges {

	@Input() availableWords:string[] = [];
	@Input() discoveredWords:string[] = [];

	words:string[] = [];

	ngOnInit():void {
		this.refreshWords();
	}

	ngOnChanges(changes:SimpleChanges):void {
		this.refreshWords();
	}

	refreshWords():void{
		this.words = [];
		this.availableWords.forEach((word:string):void => {
			if(this.discoveredWords.includes(word)){
				this.words.push(word);
			}else{
				this.words.push('X'.repeat(word.length));
			}
		});
	}

}
