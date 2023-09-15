import { NgModule } from '@angular/core';
import { ShellRoutingModule } from './shell-routing.module';
import { HeaderComponent } from '../layouts/components/header/header.component';
import { ShellComponent } from './shell.component';
import { FooterComponent } from '../layouts/components/footer/footer.component';
import {
  NgbActiveModal, NgbActiveOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { SharedModule } from '../@shared/shared.module';
import { ResearchSidebarComponent } from '../layouts/components/research-sidebar/research-sidebar.component';
import { LeftSidebarComponent } from '../layouts/components/left-sidebar/left-sidebar.component';

@NgModule({
  declarations: [
    ShellComponent,
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent,
    ResearchSidebarComponent,
  ],
  providers: [
    NgbActiveModal,
    NgbActiveOffcanvas,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
  imports: [
    ShellRoutingModule,
    SharedModule,
    LazyLoadImageModule,
  ],
})
export class ShellModule {}
