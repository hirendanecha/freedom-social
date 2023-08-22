import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css'],
})
export class DeletePostComponent {
  @Input() cancelButtonLabel: string | undefined;
  @Input() confirmButtonLabel: string | undefined;
  @Input() title: string | undefined;
  @Input() message: string | undefined; 
  @Input() closeIcon: boolean | undefined;
  constructor(public activeModal: NgbActiveModal) {}
}
