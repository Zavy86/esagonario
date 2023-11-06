import {Component, Input, OnInit} from '@angular/core';
import * as dayjs from "dayjs";

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class SelectorComponent implements OnInit{

	@Input() uid:string = 'latest';

	current:string|undefined;
	previous:string|undefined;
	next:string|undefined;

	ngOnInit():void {
		let uidDate = new Date();
		if(this.uid != 'latest'){ uidDate = new Date(this.uid); }
		this.current = dayjs(uidDate).format('YYYY-MM-DD');
		let todayDate:Date = new Date();
		let today:string = dayjs(todayDate).format('YYYY-MM-DD');
		this.previous = dayjs(uidDate).subtract(1,'day').format('YYYY-MM-DD');
		if(this.current!=today){
			this.next = dayjs(uidDate).add(1,'day').format('YYYY-MM-DD');
		}
	}

	changeGame(uid:string|undefined):void {
		if(uid){ window.location.href = '/Game/' + uid; }
	}

}
