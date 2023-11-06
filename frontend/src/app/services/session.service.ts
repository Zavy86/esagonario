import { Injectable } from '@angular/core';
import * as adjectives from './session.adjectives.json';
import * as nouns from './session.nouns.json';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

	uuid:string;
	nickname:string;

  constructor(){
		this.uuid = localStorage.getItem('uuid') ?? this.generateUUID();
		console.log('uuid',this.uuid);
		this.nickname = localStorage.getItem('nickname') ?? this.generateNickname();
	}

	changeNickname(nickname:string):void {
		if(!nickname || nickname.length < 3 || nickname.length > 9){return;}
		localStorage.setItem('nickname',nickname);
		this.nickname = nickname;
	}

	private generateUUID():string {
		const uuid:string = (Math.random().toString(36).substring(2,11) + Math.random().toString(36).substring(2,11));
		localStorage.setItem('uuid',uuid);
		return uuid;
	}

	private generateNickname():string {
		const availableNouns:string[] = nouns;
		const availableAdjectives:string[] = adjectives;
		const noun:string = availableNouns[Math.floor(Math.random()*availableNouns.length)];
		const adjective:string = availableAdjectives[Math.floor(Math.random()*availableAdjectives.length)];
		const nickname:string = adjective + '-' + noun;
		localStorage.setItem('nickname',nickname);
		return nickname;
	}

}
