import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEventComponent } from './add-event/add-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  activeTab = 1;
  constructor(
    private modalService: NgbModal
  ) {

  }

  createEvent() {
    const modalRef = this.modalService.open(AddEventComponent, { centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Post';
    modalRef.componentInstance.closeIcon = true;
  }
}
