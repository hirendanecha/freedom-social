import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreedomPageComponent } from './add-page/add-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freedom-page',
  templateUrl: './freedom-page.component.html',
  styleUrls: ['./freedom-page.component.scss'],
})
export class FreedomPageComponent {
  activeTab = 1;
  constructor(private modalService: NgbModal, private router: Router) {}

  createCommunity() {
    const modalRef = this.modalService.open(AddFreedomPageComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.confirmButtonLabel = 'Create';
    modalRef.componentInstance.closeIcon = true;
    modalRef.result.then(res => {
      if (res === 'success') {
        this.activeTab = 0;
        setTimeout(() => {
          this.activeTab = 1;
        }, 100);
      }
    });
  }

  goToFindCommunity() {
    this.router.navigate(['/communities-post']);
  }
}
