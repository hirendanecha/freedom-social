import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCommunityModalComponent } from './add-community-modal/add-community-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunityService } from '../services/community.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent {
  activeIdTab: string = 'my';
  communities: any = [];
  profileId: number = null;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService
  ) {
    this.profileId = Number(sessionStorage.getItem('profileId'));

    this.getCommunities();

    console.log('spinner : ', spinner.spinnerObservable);
  }

  getCommunities(): void {
    let getCommunitiesObs = null;
    this.communities = [];
    this.spinner.show();

    if (this.activeIdTab === 'joined') {
      getCommunitiesObs = this.communityService.getJoinedCommunityByProfileId(this.profileId);
    } else if (this.activeIdTab === 'local') {
      getCommunitiesObs = this.communityService.getCommunity(this.profileId);
    } else {
      getCommunitiesObs = this.communityService.getCommunityByUserId(this.profileId);
    }

    getCommunitiesObs?.subscribe({
      next: (res: any) => {
        this.spinner.hide();

        if (res?.data) {
          this.communities = res?.data;
        } else {
          this.communities = [];
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      }
    });
  }

  createCommunity() {
    const modalRef = this.modalService.open(AddCommunityModalComponent, {
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
        this.getCommunities();
      }
    });
  }
}
