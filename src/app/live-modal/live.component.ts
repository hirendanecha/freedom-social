import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-live-modal',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
