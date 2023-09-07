import { NgModule } from '@angular/core';
import { ShellRoutingModule } from './shell-routing.module';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { MyProfileComponent } from '../left-side-bar/my-profile.component';
import { MyListComponent } from '../right-side-bar/my-list.component';
import { ShellComponent } from './shell.component';
import { FooterComponent } from '../footer/footer.component';
import {
  NgbActiveModal,
  NgbCollapseModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PipeModule } from '../pipe/pipe.module';
import { ToastsContainer } from '../services/toast-container.component';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { SharedModule } from '../@shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, ShellComponent, FooterComponent],
  exports: [HeaderComponent, ShellComponent, FooterComponent],
  providers: [
    NgbActiveModal,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
  imports: [
    ShellRoutingModule,
    SharedModule,
    PickerModule,
    PipeModule,
    ToastsContainer,
    LazyLoadImageModule,
  ],
})
export class ShellModule {}
