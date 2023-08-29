import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './community.component';
import { CommunityRegisterComponent } from './create-community/community-register.component';
import { ViewCommunityComponent } from './view-community/view-community.component';
import { HomeComponent } from '../home/home.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityComponent,
  },
  {
    path: 'community-registration',
    component: CommunityRegisterComponent,
  },
  {
    path: ':id',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
