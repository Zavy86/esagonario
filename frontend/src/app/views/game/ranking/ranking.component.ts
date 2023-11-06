import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {RecordModel} from "@shared/models";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnChanges {

	@Input() allRecords:RecordModel[] = [];

	showAll:boolean = false;
	ranking:{rank:number,nickname:string}[] = [];

	ngOnChanges(changes:SimpleChanges):void {
		console.log(changes);
		if('allRecords' in changes){ this.refreshRanking(); }
	}

	toggleShow():void{
		this.showAll = !this.showAll;
		this.refreshRanking();
	}

	private refreshRanking():void {
		this.ranking = [];
		for(let index:number = 0;index < (this.showAll ? this.allRecords.length : 3); index++){
			this.ranking.push({rank:(index+1),nickname:this.allRecords[index].nickname});
		}
	}
}
