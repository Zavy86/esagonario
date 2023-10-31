import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {

  @Output() letterSelected:EventEmitter<string> = new EventEmitter();
  @Output() deleteCommand:EventEmitter<null> = new EventEmitter();
  @Output() enterCommand:EventEmitter<null> = new EventEmitter();

  @Input() letters:string[] = [];

  clicked(index:number):void {
    console.log(index,this.letters[index]);
    this.letterSelected.emit(this.letters[index]);
  }

  delete():void {
    console.log('delete');
    this.deleteCommand.emit();
  }

  enter():void {
    console.log('enter');
    this.enterCommand.emit();
  }

}
