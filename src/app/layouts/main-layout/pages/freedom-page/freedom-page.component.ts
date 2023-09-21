import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreedomPageComponent } from './add-page-modal/add-page-modal.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from 'src/app/@shared/services/community.service';

@Component({
  selector: 'app-freedom-page',
  templateUrl: './freedom-page.component.html',
  styleUrls: ['./freedom-page.component.scss'],
})
export class FreedomPageComponent {
  activeIdTab: string = 'my';
  pageList = []
  profileId: number
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService
  ) {
    this.profileId = Number(sessionStorage.getItem('profileId'));

    this.getPages();

    console.log('spinner : ', spinner.spinnerObservable);
  }

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
        this.activeIdTab = 'my';
        this.getPages();
      }
    });
  }

  getPages(): void {
    let getCommunitiesObs = null;
    this.pageList = [];
    this.spinner.show();

    if (this.activeIdTab === 'joined') {
      getCommunitiesObs = this.communityService.getJoinedCommunityByProfileId(this.profileId, 'page');
    } else if (this.activeIdTab === 'local') {
      getCommunitiesObs = this.communityService.getCommunity(this.profileId, 'page');
    } else {
      getCommunitiesObs = this.communityService.getCommunityByUserId(this.profileId, 'page');
    }

    getCommunitiesObs?.subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res?.data) {
          this.pageList = res?.data;
        } else {
          this.pageList = [];
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      }
    });
  }

  goToFindCommunity() {
    this.router.navigate(['/communities-post']);
  }
}