import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../home/login/login.component';
import { AuthenticationGuard } from '../services/authentication.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    // canActivate: [AuthenticationGuard],
    loadChildren: () => import('../home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'community',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../community/community.module').then((m) => m.CommunityModule),
  },
  {

    path: 'favorite',
    loadChildren: () =>
      import('../favorites/favorite.module').then((m) => m.FavoriteModule),
  },
  {
    path: 'settings',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../setting/setting.module').then((m) => m.SettingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
