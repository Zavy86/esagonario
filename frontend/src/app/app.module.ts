import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {GameComponent} from './views/game/game.component';
import {HttpClientModule} from "@angular/common/http";
import { GameHiveComponent } from 'src/app/views/game/hive/game-hive.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    GameComponent,
    GameHiveComponent
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
