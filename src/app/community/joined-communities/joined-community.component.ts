import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { CommunityService } from 'src/app/services/community.service';
import { ToastService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-joined-community',
  templateUrl: './joined-community.component.html',
  styleUrls: ['./joined-community.component.scss'],
})
export class JoinedCommunityComponent implements OnInit {
  communityList = [];
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private modalService: NgbModal,
    private toaster: ToastService
  ) {}

  ngOnInit(): void {
    this.getCommunityList();
  }

  goToCommunityDetails(community): void {
    const communityName = community.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    console.log(communityName);
    this.router.navigate([`community/${communityName}`], {
      state: {
        data: { id: community.Id },
      },
    });
    // this.router.navigateByUrl(`community/c/${communityName}`, {
    //   query: community.Id,
    // });
  }

  getCommunityList(): void {
    this.spinner.show();
    const profileId = sessionStorage.getItem('profileId');
    this.communityService.getJoinedCommunityByProfileId(profileId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          this.communityList = res.data;
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  removeFromCommunity(id): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Leave Community';
    modalRef.componentInstance.confirmButtonLabel = 'Leave';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to Leave from this community?';
    modalRef.result.then((res) => {
      console.log(res);
      if (res === 'success') {
        const profileId = Number(sessionStorage.getItem('profileId'));
        this.communityService.removeFromCommunity(id, profileId).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunityList();
            }
          },
          error: (error) => {
            console.log(error);
            this.toaster.danger(error.message);
          },
        });
      }
    });
  }
}
