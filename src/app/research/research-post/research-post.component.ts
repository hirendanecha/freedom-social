import { Component } from '@angular/core';
import { researches } from 'src/app/@shared/data/dummy-research';

@Component({
  selector: 'app-research-post',
  templateUrl: './research-post.component.html',
  styleUrls: ['./research-post.component.scss']
})
export class ResearchPostComponent {

  researches = researches;
}
