import { NgModule } from '@angular/core';

import { ShellRoutingModule } from './shell-routing.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { HomeComponent } from '../home/home.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { ShellComponent } from './shell.component';
import { PostComponent } from '../poast-modal/post.component';
import { FooterComponent } from '../footer/footer.component';
import { PeopleModule } from '../people/people.module';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    MyProfileComponent,
    MyListComponent,
    ShellComponent,
    PostComponent,
    FooterComponent
  ],
  imports: [
    ShellRoutingModule,
    CommonModule,
    NgbModule
  ],
  exports: [
    HeaderComponent,
    MyProfileComponent,
    MyListComponent,
    ShellComponent,
    FooterComponent
  ],
  providers: [
    NgbActiveModal,
  ]
})
export class ShellModule { }
