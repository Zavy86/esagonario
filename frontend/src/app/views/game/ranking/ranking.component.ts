import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {RecordType} from "@shared/types";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnChanges {

	@Input() allRecords:RecordType[] = [];

	showAll:boolean = false;
	ranking:{rank:number,points:number,nickname:string}[] = [];

	ngOnChanges(changes:SimpleChanges):void {
		if('allRecords' in changes){ this.refreshRanking(); }
	}

	toggleShow():void{
		this.showAll = !this.showAll;
		this.refreshRanking();
	}

	private refreshRanking():void {
		this.ranking = [];
		for(let index:number = 0; index < ( this.showAll ? this.allRecords.length : 3 ); index++){
			if(index in this.allRecords) {
				this.ranking.push({
					rank: (index + 1),
					points: this.allRecords[index].points,
					nickname: this.allRecords[index].nickname
				});
			}
		}
	}
}
