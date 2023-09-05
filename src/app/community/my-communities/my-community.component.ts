import { query } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeletePostComponent } from 'src/app/@shared/delete-post-dialog/delete-post.component';
import { CommunityService } from 'src/app/services/community.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-my-community',
  templateUrl: './my-community.component.html',
  styleUrls: ['./my-community.component.scss'],
})
export class MyCommunityComponent implements OnInit {
  communityList = [];
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
    this.communityList = [];
    this.communityService.getCommunityByUserId(this.profileId).subscribe(
      (res: any) => {
        if (res.data) {
          this.spinner.hide();
          // this.communityList = res.data;
          res.data.forEach((element) => {
            if (element.Id) {
              this.communityList.push(element);
            }
          });
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
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

  deleteCommunity(id): void {
    const modalRef = this.modalService.open(DeletePostComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Community';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this community?';
    modalRef.result.then((res) => {
      console.log(res);
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