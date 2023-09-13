import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPostDetailsComponent } from './user-posts/user-posts-details.component';

const routes: Routes = [
  {
    path: ':id',
    component: UserPostDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule {}
