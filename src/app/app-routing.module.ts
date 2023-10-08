import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DotAssistantComponent } from './dot-assistant/dot-assistant.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'dot', component: DotAssistantComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
