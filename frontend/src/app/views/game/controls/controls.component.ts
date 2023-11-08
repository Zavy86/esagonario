import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {LogsService} from "src/app/services/logs.service";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

	@Output() enterCommand:EventEmitter<null> = new EventEmitter();
	@Output() deleteCommand:EventEmitter<null> = new EventEmitter();
	@Output() letterSelected:EventEmitter<string> = new EventEmitter();

  @Input() letters:string[] = [];
  @Input() suggestions:string[] = [];

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent):void {
		if(event.key == 'Enter'){this.enterCommand.emit();}
		if(event.key == 'Backspace'){this.deleteCommand.emit();}
		if(this.letters.includes(event.key.toUpperCase())){
			this.letterSelected.emit(event.key.toUpperCase());
		}
	}

	constructor(
		private logsService:LogsService
	){}

  clicked(index:number):void {
		this.logsService.log(index,this.letters[index]);
    this.letterSelected.emit(this.letters[index]);
  }

  delete():void {
		this.logsService.log('delete');
    this.deleteCommand.emit();
  }

  enter():void {
		this.logsService.log('enter');
    this.enterCommand.emit();
  }

}
