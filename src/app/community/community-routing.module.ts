import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommunityComponent } from './community.component';
import { CommunityRegisterComponent } from './create-community/community-register.component';
import { ViewCommunityComponent } from './view-community/view-community.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityRegisterComponent,
  },
  {
    path: 'community-post',
    component: CommunityComponent,
  },
  {
    path: ':id',
    component: ViewCommunityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule {}
