import {Component, EventEmitter, Output} from '@angular/core';
import {SessionService} from "src/app/services/session.service";

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss']
})
export class NicknameComponent {

	@Output() nicknameChanged:EventEmitter<string> = new EventEmitter();

	nickname:string;

	constructor(
		private sessionService:SessionService
	){
		this.nickname = sessionService.nickname;
	}

	changeNickname() {
		let nickname:string = prompt('Enter your nickname:')?.trim() as string;
		if(!nickname){return;}
		if(nickname.length < 3){return alert('Nickname must be no less than 3 characters!');}
		if(nickname.length > 9){return alert('Nickname must be no longer than 9 characters!');}
		this.sessionService.changeNickname(nickname);
		this.nicknameChanged.emit(nickname);
		this.nickname = nickname;
	}

}
