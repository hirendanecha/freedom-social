import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../@shared/services/authentication.guard';
import { ShellComponent } from './shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('../pages/home/home.module').then((m) => m.HomeModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true
        }
      },
      {
        path: 'post',
        loadChildren: () => import('../pages/posts/post.module.').then((m) => m.PostModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true
        }
      },
      {
        path: 'communities',
        loadChildren: () => import('../pages/communities/communities.module').then((m) => m.CommunitiesModule),
        data: {
          isShowLeftSideBar: true
        }
      },
      {
        path: 'pages',
        loadChildren: () => import('../pages/freedom-page/freedom-page.module').then((m) => m.FreedomPageModule),
        data: {
          isShowLeftSideBar: true
        }
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then((m) => m.SettingsModule),
        data: {
          isShowLeftSideBar: true
        }
      },
      {
        path: 'notifications',
        loadChildren: () => import('../pages/notifications/notification.module').then((m) => m.NotificationsModule),
        data: {
          isShowLeftSideBar: true
        }
      },
      {
        path: 'research',
        loadChildren: () => import('../pages/research/research.module').then((m) => m.ResearchModule),
        data: {
          isShowLeftSideBar: true,
          isShowRightSideBar: true,
          isShowResearchLeftSideBar: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellRoutingModule { }
