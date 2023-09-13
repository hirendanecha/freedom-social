import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../@shared/services/authentication.guard';
import { ShellComponent } from './shell.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { LeftSidebarLayoutComponent } from '../layouts/left-sidebar-layout/left-sidebar-layout.component';
import { RightSidebarLayoutComponent } from '../layouts/right-sidebar-layout/right-sidebar-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        component: MainLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then((m) => m.HomeModule),
          },
          {
            path: 'post',
            loadChildren: () => import('../pages/posts/post.module.').then((m) => m.PostModule),
          },
        ],
      },
      {
        path: '',
        component: LeftSidebarLayoutComponent,
        children: [
          {
            path: 'communities',
            loadChildren: () => import('../pages/communities/communities.module').then((m) => m.CommunitiesModule),
            data: { isShowRightSidebar: false  }
          },
          {
            path: 'pages',
            loadChildren: () => import('../pages/freedom-page/freedom-page.module').then((m) => m.FreedomPageModule),
          },
          {
            path: 'settings',
            loadChildren: () => import('../pages/settings/settings.module').then((m) => m.SettingsModule),
          },
          {
            path: 'notifications',
            loadChildren: () => import('../pages/notifications/notification.module').then((m) => m.NotificationsModule),
          },
        ],
      },
      {
        path: '',
        component: RightSidebarLayoutComponent,
        children: [
          {
            path: 'research',
            loadChildren: () => import('../pages/research/research.module').then((m) => m.ResearchModule),
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule { }
