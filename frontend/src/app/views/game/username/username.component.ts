import {Component, OnInit} from '@angular/core';
import * as adjectives from './adjectives.json';
import * as nouns from './nouns.json';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit{

	username:string = '';

	ngOnInit():void {
		this.username = localStorage.getItem('username') ?? this.generate();
	}

	private generate():string {
		const availableNouns:string[] = nouns;
		const availableAdjectives:string[] = adjectives;
		const noun:string = availableNouns[Math.floor(Math.random()*availableNouns.length)];
		const adjective:string = availableAdjectives[Math.floor(Math.random()*availableAdjectives.length)];
		const username = adjective + '-' + noun;
		localStorage.setItem('username',username);
		return username;
	}

	changeUsername() {
		let username:string = prompt('Enter your username:')?.trim() as string;
		if(!username){return;}
		if(username.length < 3){return alert('Username must be at least 3 characters long!');}
		localStorage.setItem('username',username);
		this.username = username;
	}

}
