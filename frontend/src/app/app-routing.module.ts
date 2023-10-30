import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from "src/app/views/not-found/not-found.component";
import {GameComponent} from "src/app/views/game/game.component";

const routes: Routes = [
  {path:'',redirectTo:'Game/latest',pathMatch:'full'},
  {path:'Game',redirectTo:'Game/latest',pathMatch:'full'},
  {path:'Game/:uid',component:GameComponent},
  {path:'**',component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
