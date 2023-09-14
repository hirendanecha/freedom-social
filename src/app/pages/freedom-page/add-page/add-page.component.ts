import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Community } from 'src/app/@shared/constant/customer';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { UploadFilesService } from 'src/app/@shared/services/upload-files.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddFreedomPageComponent {
  @Input() closeIcon: boolean | undefined;

  pageDetails = new Community();
  submitted = false;
  registrationMessage = '';
  selectedFile: File;
  logoImg: any;
  coverImg: any;
  userId = '';
  profileId = '';
  originUrl = environment.webUrl + 'page/';
  constructor(
    public activeModal: NgbActiveModal,
    private uploadService: UploadFilesService,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private toastService: ToastService
  ) {
    this.userId = window.sessionStorage.user_id;
    this.profileId = sessionStorage.getItem('profileId');
  }

  selectFiles(event, type) {
    this.selectedFile = event.target.files;
    this.upload(this.selectedFile, type);
  }

  upload(file, defaultType): any {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }
    this.spinner.show();
    this.communityService
      .upload(file[0], this.profileId, defaultType)
      .subscribe(
        {
          next: (res: any) => {
            this.spinner.hide();
            if (res.body) {
              if (defaultType === 'community-logo') {
                this.logoImg = res?.body?.url;
              } else if (defaultType === 'community-cover') {
                this.coverImg = res?.body?.url;
              }
            }
          },
          error:
            (err) => {
              this.spinner.hide();
              this.selectedFile = undefined;
              return 'Could not upload the file:' + file.name;
            }
        }
      );
  }

  onSubmit() {
    this.spinner.show();
    if (this.pageDetails.CommunityName && this.logoImg && this.coverImg) {
      this.pageDetails.profileId = this.profileId;
      this.pageDetails.logoImg = this.logoImg;
      this.pageDetails.coverImg = this.coverImg;
      this.pageDetails.pageType = 'page';
      this.pageDetails.isApprove = 'Y';
      if (this.pageDetails) {
        this.communityService.createCommunity(this.pageDetails).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (!res.error) {
                this.submitted = true;
                this.createCommunityAdmin(res.data);
                this.activeModal.close('success');
                this.toastService.success('Your Local Community will be approved withing 24 hours!');
                // this.router.navigateByUrl('/home');
              }
            },
            error:
              (err) => {
                this.toastService.danger('Please change community name. this community name already in use.');
                this.spinner.hide();
              }
          });
      }
    } else {
      this.spinner.hide();
      this.toastService.danger('Please enter mandatory fields(*) data.');
    }
  }

  getProfilePic() {
    // this.spinner.show();
    this.communityService.getLogoImg(this.userId).subscribe(
      {
        next: (res: any) => {
          if (res.length) {
            // this.spinner.hide();
            this.logoImg = res[0];
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
    this.communityService.getCoverImg(this.userId).subscribe(
      {
        next: (res: any) => {
          if (res) {
            // this.spinner.hide();
            this.coverImg = res[0];
          }
        },
        error:
          (error) => {
            // this.spinner.hide();
            console.log(error);
          }
      });
  }

  createCommunityAdmin(id): void {
    const data = {
      profileId: this.profileId,
      communityId: id,
      isActive: 'Y',
      isAdmin: 'Y',
    };
    this.communityService.joinCommunity(data).subscribe(
      {
        next: (res: any) => {
          if (res) {
            return res;
          }
        },
        error:
          (error) => {
            console.log(error);
          }
      });
  }
}
