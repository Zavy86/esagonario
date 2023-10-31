import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {GameComponent} from './views/game/game.component';
import {InputComponent} from './views/game/input/input.component';
import {ControlsComponent} from 'src/app/views/game/controls/controls.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    GameComponent,
    InputComponent,
    ControlsComponent
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
