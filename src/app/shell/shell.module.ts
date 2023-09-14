import { NgModule } from '@angular/core';
import { ShellRoutingModule } from './shell-routing.module';
import { HeaderComponent } from '../layouts/components/header/header.component';
import { ShellComponent } from './shell.component';
import { FooterComponent } from '../layouts/components/footer/footer.component';
import {
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from '../@shared/services/toast-container.component';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { SharedModule } from '../@shared/shared.module';
import { ResearchSidebarComponent } from '../layouts/components/research-sidebar/research-sidebar.component';
import { LeftSidebarComponent } from '../layouts/components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../layouts/components/right-sidebar/right-sidebar.component';

@NgModule({
  declarations: [
    ShellComponent,
    HeaderComponent,
    FooterComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ResearchSidebarComponent
  ],
  providers: [
    NgbActiveModal,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
  imports: [
    ShellRoutingModule,
    SharedModule,
    ToastsContainer,
    LazyLoadImageModule,
  ],
})
export class ShellModule {}
