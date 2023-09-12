import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../services/post.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { CustomerService } from '../services/customer.service';
import { ToastService } from '../services/toaster.service';
import { CommunityService } from '../services/community.service';
import { ConfirmationModalComponent } from '../@shared/modals/confirmation-modal/confirmation-modal.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown }) userSearchNgbDropdown: NgbDropdown;
  @ViewChild('postMessageInput', { static: false }) postMessageInput: ElementRef;

  ngUnsubscribe: Subject<void> = new Subject<void>();

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

  userList = [];
  userNameSearch = '';

  activeCommunityTab: number = 1;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private postService: PostService,
    public sharedService: SharedService,
    private router: Router,
    private socketService: SocketService,
    private customerService: CustomerService,
    private renderer: Renderer2,
    private toaster: ToastService,
    private communityService: CommunityService,
    private route: ActivatedRoute
  ) {
    this.profileId = sessionStorage.getItem('profileId');
    this.postData.profileid = +this.profileId;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: RouterEvent | any) => {
      const name = this.route.snapshot.params.name;

      if ((event instanceof NavigationEnd || event instanceof Scroll) && name) {
        this.communitySlug = name;
        this.getCommunityDetailsByName();
      }
    });
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
    console.log(this.socketService.socket);

    if (!this.socketService.socket.connected) {
      this.socketService.socket.connect();
    }

    this.socketService.socket.emit('join', { room: this.profileId });
    this.socketService.socket.on('notification', (data: any) => {
      console.log('notification data ==>', data);
      this.sharedService.isNotify = true;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file) {
      this.postData['file'] = file;
      this.postData['imageUrl'] = URL.createObjectURL(file);
    }
    console.log('this.postData[files] : ', this.postData['file']);
  }

  removePostSelectedFile(): void {
    this.postData['file'] = null;
    this.postData['imageUrl'] = '';
  }

  getCommunityDetailsByName(): void {
    if (this.communitySlug) {
      this.spinner.show();
      this.communityService.getCommunityBySlug(this.communitySlug).subscribe(
        {
          next: (res: any) => {
            this.spinner.hide();
            if (res) {
              if (res?.[0]?.Id) {
                const details = res?.[0];

                if (details?.members > 0) {
                  if (details?.memberList?.length > 0) {
                    details['memberIds'] = details?.memberList?.map(
                      (member: any) => member?.profileId
                    );
                  }

                  this.communityDetails = details;
                  this.postData.communityId = this.communityDetails?.Id;
                } else {
                  this.router.navigate(['local-community']);
                }
              }
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
            this.toaster.success(res.message);
            this.getCommunityDetailsByName();
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
    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      if (this.postData?.file?.name) {
        this.spinner.show();
        this.postService.upload(this.postData?.file, this.profileId).subscribe({
          next: (res: any) => {
            if (res?.body?.url) {
              this.postData['file'] = null;
              this.postData['imageUrl'] = res?.body?.url;
              this.submit();
            }

            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
          },
        });
      } else {
        this.submit();
      }
    }
  }

  submit(): void {
    if (this.postData.id) {
      this.editPost();
    } else {
      this.createNewPost();
    }
  }

  createNewPost(): void {
    const anchorTags = this.postMessageInput?.nativeElement?.children;

    this.postData.tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        this.postData.tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      this.spinner.show();
      this.socketService.createPost(this.postData, (data) => {
        this.spinner.hide();
        this.toaster.success('Post created successfully.');

        this.postData['postdescription'] = '';
        this.postData['meta'] = {};
        this.postData['tags'] = [];
        this.postData['file'] = {};
        this.postData['imageUrl'] = '';

        return data;
      });

      this.clearUserSearchData();
      this.renderer.setProperty(
        this.postMessageInput.nativeElement,
        'innerHTML',
        ''
      );

      // this.socketService.socket.on(
      //   'new-post-added',
      //   (res: any) => {
      //     console.log('res: ', res);

      //     this.postList.push(res);
      //     this.spinner.hide();
      //     this.activePage = 1;

      //     this.postData['postdescription'] = '';
      //     this.postData['meta'] = {};
      //     this.postData['tags'] = [];
      //     this.postData['file'] = {};
      //     this.postData['imageUrl'] = '';
      //   },
      //   (error: any) => {
      //     this.spinner.hide();
      //     console.log(error);
      //   }
      // );
    }
  }

  getLinkData(): void {
    const postHtml = this.postMessageInput.nativeElement.innerHTML;
    const matches = postHtml.match(/(((https?:\/\/)|(www\.))[^\s]+)/gi);
    console.log('matches : ', matches);

    if (matches?.length > 0) {
      const url = matches[0];

      if (!this.postData?.meta?.url?.includes(url)) {
        this.spinner.show();
        this.ngUnsubscribe.next();

        this.postService
          .getMetaData({ url })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (res: any) => {
              if (res?.meta?.image) {
                this.postData.meta = {
                  title: res?.meta?.title,
                  metadescription: res?.meta?.description,
                  metaimage: res.meta?.image?.url,
                  metalink: res?.meta?.url || url,
                  url: url,
                };
              }

              this.spinner.hide();
            },
            error: () => {
              this.spinner.hide();
            },
          });
      }
    }
  }

  messageOnKeyEvent(): void {
    this.getLinkData();

    const text = this.postMessageInput.nativeElement.innerHTML;
    const atSymbolIndex = text.lastIndexOf('@');

    if (atSymbolIndex !== -1) {
      this.userNameSearch = text.substring(atSymbolIndex + 1);
      console.log('userNameSearch : ', this.userNameSearch);

      if (this.userNameSearch?.length > 2) {
        this.getUserList(this.userNameSearch);
      } else {
        this.clearUserSearchData();
      }
    } else {
      this.clearUserSearchData();
    }
    console.log(text);
    this.postData.postdescription = text;
  }

  getUserList(search: string): void {
    this.customerService.getProfileList(search).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data;
          this.userSearchNgbDropdown.open();
        } else {
          this.clearUserSearchData();
        }
      },
      error: () => {
        this.clearUserSearchData();
      },
    });
  }

  clearUserSearchData(): void {
    this.userNameSearch = '';
    this.userList = [];
    this.userSearchNgbDropdown.close();
  }

  selectTagUser(user: any): void {
    const postHtml = this.postMessageInput.nativeElement.innerHTML;
    const text = postHtml.replace(
      `@${this.userNameSearch}`,
      `<a href="/settings/view-profile/${user?.Id}" class="text-warning" data-id="${user?.Id}">@${user?.Username}</a>`
    );
    console.log('postHtml : ', postHtml);

    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      text
    );

    this.postData.postdescription = text;
  }

  editPost(): void {
    const anchorTags = this.postMessageInput?.nativeElement?.children;
    this.postData.tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        this.postData.tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    console.log('this.postData : ', this.postData);

    if (this.postData?.postdescription) {
      this.spinner.show();
      this.socketService.editPost(this.postData, (data) => {
        this.spinner.hide();
        this.toaster.success('Post edited successfully.');
        return data;
      });
      this.postData['id'] = '';
      this.postData['postdescription'] = '';
      this.postData['meta'] = {};
      this.postData['tags'] = [];
      this.postData['file'] = {};
      this.postData['imageUrl'] = '';
      this.spinner.hide();

      this.clearUserSearchData();
      this.renderer.setProperty(
        this.postMessageInput.nativeElement,
        'innerHTML',
        ''
      );
    }
  }

  resetPost() {
    this.postData = {};
    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      ''
    );
  }

  onEditPost(post: any): void {
    this.postData = { ...post };

    this.renderer.setProperty(
      this.postMessageInput.nativeElement,
      'innerHTML',
      this.postData?.postdescription
    );

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
          this.getCommunityDetailsByName();
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
      console.log(res);
      if (res === 'success') {
        const profileId = Number(sessionStorage.getItem('profileId'));
        this.communityService.removeFromCommunity(this.communityDetails?.Id, profileId).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunityDetailsByName();
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
      console.log(res);
      if (res === 'success') {
        this.communityService.deleteCommunity(this.communityDetails?.Id).subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunityDetailsByName();
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
}
