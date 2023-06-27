import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { BlockListComponent } from './block-list/block-list.component';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { SuggesationComponent } from './suggesation/suggesation.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent
  },
  {
    path: 'all-friends',
    component: PeopleComponent
  },
  {
    path: 'block-list',
    component: BlockListComponent
  },
  {
    path: 'friend-request',
    component: FriendRequestComponent
  },
  {
    path: 'suggesation',
    component: SuggesationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
