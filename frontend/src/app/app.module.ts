import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {NgxTooltipDirectivesModule} from "ngx-tooltip-directives";
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {GameComponent} from './views/game/game.component';
import {ControlsComponent} from './views/game/controls/controls.component';
import {InputComponent} from './views/game/input/input.component';
import {NicknameComponent} from './views/game/nickname/nickname.component';
import {PointsComponent} from './views/game/points/points.component';
import {ProgressComponent} from './views/game/progress/progress.component';
import {RankingComponent} from './views/game/ranking/ranking.component';
import {SelectorComponent} from './views/game/selector/selector.component';
import {WordsComponent} from './views/game/words/words.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    GameComponent,
		ControlsComponent,
		InputComponent,
		NicknameComponent,
		PointsComponent,
		ProgressComponent,
		RankingComponent,
		SelectorComponent,
		WordsComponent
	],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
		NgxTooltipDirectivesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
