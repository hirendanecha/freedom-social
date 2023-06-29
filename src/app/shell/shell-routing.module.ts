import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
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
  {
    path: 'favorite',
    loadChildren: () => import('../favorites/favorite.module').then((m) => m.FavoriteModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../setting/setting.module').then((m) => m.SettingModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule { }
