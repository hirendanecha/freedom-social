import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/@shared/modals/confirmation-modal/confirmation-modal.component';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { CustomerService } from 'src/app/@shared/services/customer.service';
import { PostService } from 'src/app/@shared/services/post.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { getTagUsersFromAnchorTags } from 'src/app/@shared/utils/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  postMessageInputValue: string = '';
  postMessageTags: any[];
  postData: any = {
    profileid: '',
    communityId: '',
    postdescription: '',
    meta: {},
    tags: [],
    file: {},
    imageUrl: '',
  };

  communitySlug: string;
  communityDetails: any;
  profileId = '';

  activeCommunityTab: number = 1;
  isNavigationEnd = false;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private socketService: SocketService,
    private toastService: ToastService,
    private communityService: CommunityService,
    private route: ActivatedRoute,
  ) {
    this.profileId = sessionStorage.getItem('profileId');
    this.postData.profileid = +this.profileId;

    this.route.paramMap.subscribe((paramMap) => {
      const name = paramMap.get('name');

      if (name) {
        this.communitySlug = name;
        this.getCommunityDetailsBySlug();
      }

      this.isNavigationEnd = true;
    })
  }

  ngOnInit(): void {
    this.socketService.socket.on(
      'new-post-added',
      (res: any) => {
        this.spinner.hide();
        this.resetPost();
      },
      (error: any) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }

    this.socketService.socket.emit('join', { room: this.profileId });
    this.socketService.socket.on('notification', (data: any) => {
      this.sharedService.isNotify = true;
    });
  }

  ngOnDestroy(): void {
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.postData['file'] = file;
      this.postData['imageUrl'] = URL.createObjectURL(file);
    }
  }

  removePostSelectedFile(): void {
    this.postData['file'] = null;
    this.postData['imageUrl'] = '';
  }

  getCommunityDetailsBySlug(): void {
    if (this.communitySlug) {
      this.spinner.show();
      this.communityService.getCommunityBySlug(this.communitySlug).subscribe(
        {
          next: (res: any) => {
            this.spinner.hide();
            if (res?.Id) {
              const details = res;

              if (details?.memberList?.length > 0) {
                details['memberIds'] = details?.memberList?.map(
                  (member: any) => member?.profileId
                );
              }

              this.communityDetails = details;
              this.postData.communityId = this.communityDetails?.Id;
            }
          },
          error:
            (error) => {
              this.spinner.hide();
              console.log(error);
            }
        });
    }
  }

  createCommunityAdmin(member: any): void {
    let data = {};
    if (member.isAdmin === 'Y') {
      data = {
        id: member?.Id,
        isAdmin: 'N',
      };
    } else {
      data = {
        id: member?.Id,
        isAdmin: 'Y',
      };
    }
    this.communityService.createCommunityAdmin(data).subscribe(
      {
        next: (res: any) => {
          if (res) {
            this.toastService.success(res.message);
            this.getCommunityDetailsBySlug();
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }

  addEmoji(event: { emoji: { native: any } }) {
    // const { message } = this;
    // const text = `${message}${event.emoji.native}`;
    // this.message = text;
  }

  uploadPostFileAndCreatePost(): void {
    if (this.postData?.postdescription || this.postData?.file?.name) {
      if (this.postData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.postData?.file, this.profileId).subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.postData['file'] = null;
              this.postData['imageUrl'] = res?.body?.url;
              this.createOrEditPost();
            }

            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
      } else {
        this.createOrEditPost();
      }
    }
  }

  createOrEditPost(): void {
    this.postData.tags = getTagUsersFromAnchorTags(this.postMessageTags);

    console.log('postData : ', this.postData);

    if (this.postData?.postdescription || this.postData?.imageUrl) {
      this.spinner.show();
      this.socketService.createOrEditPost(this.postData, (data) => {
        this.spinner.hide();
        this.toastService.success('Post created successfully.');
        return data;
      });
    }
  }

  onTagUserInputChangeEvent(data: any): void {
    this.postData.postdescription = data?.html;
    this.postData.meta = data?.meta;
    this.postMessageTags = data?.tags;
  }

  resetPost() {
    this.postData['id'] = '';
    this.postData['postdescription'] = '';
    this.postData['meta'] = {};
    this.postData['tags'] = [];
    this.postData['file'] = {};
    this.postData['imageUrl'] = '';

    this.postMessageInputValue = '';
    this.postMessageTags = [];
  }

  onEditPost(post: any): void {
    this.postData = { ...post };

    this.postMessageInputValue = this.postData?.postdescription;

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  joinCommunity(): void {
    const profileId = sessionStorage.getItem('profileId');
    const data = {
      profileId: profileId,
      communityId: this.communityDetails?.Id,
      IsActive: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      (res: any) => {
        if (res) {
          this.getCommunityDetailsBySlug();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeFromCommunity(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Leave Community';
    modalRef.componentInstance.confirmButtonLabel = 'Leave';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to Leave from this community?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        const profileId = Number(sessionStorage.getItem('profileId'));
        this.communityService.removeFromCommunity(this.communityDetails?.Id, profileId).subscribe({
          next: (res: any) => {
            if (res) {
              this.toastService.success(res.message);
              this.getCommunityDetailsBySlug();
            }
          },
          error: (error) => {
            console.log(error);
            this.toastService.danger(error.message);
          },
        });
      }
    });
  }

  deleteCommunity(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Delete Community';
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.message =
      'Are you sure want to delete this community?';
    modalRef.result.then((res) => {
      if (res === 'success') {
        this.communityService.deleteCommunity(this.communityDetails?.Id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toastService.success(res.message);
              this.getCommunityDetailsBySlug();
            }
          },
          error: (error) => {
            console.log(error);
            this.toastService.success(error.message);
          },
        });
      }
    });
  }
}