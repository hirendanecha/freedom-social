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
    path: 'local-community',
    // canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('../community/community.module').then((m) => m.CommunityModule),
  },
  {
    path: 'communities-post',
    loadChildren: () =>
      import('../favorites/favorite.module').then((m) => m.FavoriteModule),
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
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full',
      },
      {
        path: 'general',
        loadChildren: () =>
          import('../setting/setting.module').then((m) => m.SettingModule),
      },
      {
        path: 'see-first-users',
        loadChildren: () =>
          import('../see-first-user/see-first-user.module').then(
            (m) => m.SeeFirstUserModule
          ),
      },
      {
        path: 'unsubscribed-users',
        loadChildren: () =>
          import('../unsubscribed-users/unsubscribed-users.module').then(
            (m) => m.UnsubscribedUsersModule
          ),
      },
      {
        path: 'delete-profile',
        loadChildren: () =>
          import('../setting/setting.module').then((m) => m.SettingModule),
      },
    ],
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('../notifications/notification.module').then(
        (m) => m.NotificationsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule {}
