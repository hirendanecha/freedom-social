import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layouts/main-layout/main-layout.module').then((m) => m.MainLayoutModule),
  },
  {
    path: '',
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then((m) => m.AuthLayoutModule),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
