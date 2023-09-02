import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { researches } from 'src/app/@shared/data/dummy-research';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.scss']
})
export class ResearchListComponent {

  researches = researches;
  btnGroupFeedTypeCtrl: FormControl;
  btnGroupViewTypeCtrl: FormControl;

  constructor() {
    this.btnGroupFeedTypeCtrl = new FormControl('All');
    this.btnGroupViewTypeCtrl = new FormControl('TopStories');
  }
}
