import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() closeIcon: boolean | undefined;
  constructor(
    public activeModal: NgbActiveModal
  ) { }
}
