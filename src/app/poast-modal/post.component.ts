import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-modal',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
