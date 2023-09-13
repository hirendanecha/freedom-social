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
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { LeftSidebarLayoutComponent } from '../layouts/left-sidebar-layout/left-sidebar-layout.component';
import { RightSidebarLayoutComponent } from '../layouts/right-sidebar-layout/right-sidebar-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ShellComponent,
    FooterComponent,
    MainLayoutComponent,
    LeftSidebarLayoutComponent,
    RightSidebarLayoutComponent
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
