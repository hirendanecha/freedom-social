import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCommunityComponent } from './add-community/add-community.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent {
  activeTab = 1;
  constructor(private modalService: NgbModal, private router: Router) {}

  createCommunity() {
    const modalRef = this.modalService.open(AddCommunityComponent, {
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
