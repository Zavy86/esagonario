import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnChanges {

  @Input() word:string = '';
  @Input() class:string = '';

	size:string = '64px';

	ngOnChanges( changes: SimpleChanges ):void {
		if('word' in changes){
			const start:number = 64;
			let size:number = start;
			let length = changes['word'].currentValue.length;
			if( length ) {
				size = start - ( length * 3 );
				if( size < 27 ){ size = 27; }
			}
			this.size = size + 'px';
		}
	}

}
