import { NgModule } from '@angular/core';
import { HeaderComponent } from '../main-layout/components/header/header.component';
import { MainLayoutComponent } from './main-layout.component';
import { FooterComponent } from '../main-layout/components/footer/footer.component';
import {
  NgbActiveModal, NgbActiveOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import {
  LAZYLOAD_IMAGE_HOOKS,
  LazyLoadImageModule,
  ScrollHooks,
} from 'ng-lazyload-image';
import { SharedModule } from '../@shared/shared.module';
import { ResearchSidebarComponent } from '../main-layout/components/research-sidebar/research-sidebar.component';
import { LeftSidebarComponent } from '../main-layout/components/left-sidebar/left-sidebar.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
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
    MainLayoutRoutingModule,
    SharedModule,
    LazyLoadImageModule,
  ],
})
export class MainLayoutModule {}
