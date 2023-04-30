import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameComponent} from "./game/game.component";

const routes: Routes = [
  {path : '', redirectTo : '/pacman', pathMatch : "full"},
  {path : 'pacman', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
