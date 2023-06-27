import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'people',
    loadChildren: () => import('../people/people.module').then((m) => m.PeopleModule)
  },
  {
    path: 'events',
    loadChildren: () => import('../events/event.module').then((m) => m.EventsModule)
  },
  {
    path: 'community',
    loadChildren: () => import('../community/community.module').then((m) => m.CommunityModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }
