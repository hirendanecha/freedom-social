import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'communities/:name',
    component: HomeComponent,
  },
  {
    path: 'pages/:name',
    component: HomeComponent,
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
