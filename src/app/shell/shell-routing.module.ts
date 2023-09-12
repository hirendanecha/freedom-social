import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    path: 'local-communities',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../community/community.module').then((m) => m.CommunityModule),
  },
  {
    path: 'research',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../research/research.module').then((m) => m.ResearchModule),
  },
  {
    path: 'post',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../posts/post.module.').then((m) => m.PostModule),
  },
  {
    path: 'settings',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../setting/setting.module').then((m) => m.SettingModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('../notifications/notification.module').then(
        (m) => m.NotificationsModule
      ),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('../freedom-page/freedom-page.module').then(
        (m) => m.FreedomPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule { }
