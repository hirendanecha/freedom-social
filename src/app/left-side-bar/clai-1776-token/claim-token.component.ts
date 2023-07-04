import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-claim-token',
  templateUrl: './claim-token.component.html',
  styleUrls: ['./claim-token.component.css']
})
export class ClaimTokenComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
