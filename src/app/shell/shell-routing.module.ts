import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../@shared/services/authentication.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('../pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'communities',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/communities/communities.module').then((m) => m.CommunitiesModule),
  },
  {
    path: 'research',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/research/research.module').then((m) => m.ResearchModule),
  },
  {
    path: 'post',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/posts/post.module.').then((m) => m.PostModule),
  },
  {
    path: 'settings',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'notifications',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/notifications/notification.module').then((m) => m.NotificationsModule),
  },
  {
    path: 'pages',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('../pages/freedom-page/freedom-page.module').then((m) => m.FreedomPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule { }
