import { Component } from '@angular/core';
import { researches } from 'src/app/@shared/data/dummy-research';

@Component({
  selector: 'app-research-details',
  templateUrl: './research-details.component.html',
  styleUrls: ['./research-details.component.scss']
})
export class ResearchDetailsComponent {

  researches = researches;
  activeCommunityTab = 1;
}
