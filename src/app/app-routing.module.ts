import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ShellComponent
  // },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    loadChildren: () => import('./shell/shell.module').then((m) => m.ShellModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
