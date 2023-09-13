import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toaster.service';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.scss'],
})
export class MyPageComponent implements OnInit {
  pageList = [];
  communityId = '';
  isExpand = false;
  profileId: number;
  constructor(
    private communityService: CommunityService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private socketService: SocketService,
    private modalService: NgbModal,
    private toaster: ToastService
  ) {
    this.profileId = Number(sessionStorage.getItem('profileId'));
  }

  ngOnInit(): void {
    this.getCommunities();
  }

  getCommunities(): void {
    this.spinner.show();
    this.pageList = [];
    this.communityService.getCommunityByUserId(this.profileId).subscribe(
      {
        next: (res: any) => {
          this.spinner.hide();
          if (res.data) {
            // this.pageList = res.data;
            res.data.forEach((element) => {
              if (element.Id) {
                this.pageList.push(element);
              }
            });
          }
        },
        error:
          (error) => {
            this.spinner.hide();
            console.log(error);
          }
      });
  }

  goToCommunityDetails(page): void {
    const pageName = page.CommunityName.replaceAll(
      ' ',
      '-'
    ).toLowerCase();
    this.router.navigate([`page/${pageName}`], {
      state: {
        data: { id: page.Id },
      },
    });
    // this.router.navigateByUrl(`community/c/${communityName}`, {
    //   query: community.Id,
    // });
  }

  deleteCommunity(id): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Page';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this page?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.communityService.deleteCommunity(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunities();
            }
          },
          error: (error) => {
            console.log(error);
            this.toaster.success(error.message);
          },
        });
      }
    });
  }

  openDropDown(id) {
    this.communityId = id;
    if (this.communityId) {
      this.isExpand = true;
    } else {
      this.isExpand = false;
    }
  }
}
