import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {GameComponent} from './views/game/game.component';
import {InputComponent} from './views/game/input/input.component';
import {ControlsComponent} from './views/game/controls/controls.component';
import {ProgressComponent} from './views/game/progress/progress.component';
import {SelectorComponent} from './views/game/selector/selector.component';
import {WordsComponent} from './views/game/words/words.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    GameComponent,
    InputComponent,
    ControlsComponent,
    ProgressComponent,
		SelectorComponent,
		WordsComponent
	],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
