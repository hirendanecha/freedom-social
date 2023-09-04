import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-research-sidebar',
  templateUrl: './research-sidebar.component.html',
  styleUrls: ['./research-sidebar.component.scss']
})
export class ResearchSidebarComponent {

  @Input('researches') researches: any = [];
  isResearchTopicCollapse: boolean = false;

}
