import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-suggesation',
  templateUrl: './suggesation.component.html',
  styleUrls: ['./suggesation.component.css']
})
export class SuggesationComponent {
  constructor(
    private modalService: NgbModal
  ) {

  }
  
}
