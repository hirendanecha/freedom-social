import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { NgbCarouselModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../@shared/shared.module';
import { ResearchSidebarComponent } from './components/research-sidebar/research-sidebar.component';
import { ResearchListComponent } from './research-list/research-list.component';
import { ResearchDetailsComponent } from './research-details/research-details.component';
import { ResearchCardComponent } from './components/research-card/research-card.component';
import { ResearchPostComponent } from './research-post/research-post.component';


@NgModule({
  declarations: [
    ResearchSidebarComponent,
    ResearchListComponent,
    ResearchDetailsComponent,
    ResearchCardComponent,
    ResearchPostComponent
  ],
  imports: [
    SharedModule,
    NgbCollapseModule,
    ResearchRoutingModule,
    NgbCarouselModule
  ],
})
export class ResearchModule { }
