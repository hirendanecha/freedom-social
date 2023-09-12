import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { slugify } from 'src/app/@shared/utils/utils';
import { Community } from 'src/app/constant/customer';
import { CommunityService } from 'src/app/services/community.service';
import { ToastService } from 'src/app/services/toaster.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-community-modal',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss'],
})
export class AddCommunityComponent {
  @Input() closeIcon: boolean | undefined;

  communityDetails = new Community();
  submitted = false;
  registrationMessage = '';
  selectedFile: File;
  userId = '';
  profileId = '';
  originUrl = environment.webUrl + 'community/';
  logoImg: any = {
    file: null,
    url: ''
  };
  coverImg: any = {
    file: null,
    url: ''
  };


  constructor(
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private communityService: CommunityService,
    private toaster: ToastService
  ) {
    this.userId = window.sessionStorage.user_id;
    this.profileId = sessionStorage.getItem('profileId');
  }

  uploadImgAndSubmit(): void {
    let uploadObs = {};
    if (this.logoImg?.file?.name) {
      uploadObs['logoImg'] = this.communityService.upload(this.logoImg?.file, this.profileId, 'community-logo');
    }

    if (this.coverImg?.file?.name) {
      uploadObs['coverImg'] = this.communityService.upload(this.coverImg?.file, this.profileId, 'community-cover');
    }

    if (Object.keys(uploadObs)?.length > 0) {
      this.spinner.show();

      forkJoin(uploadObs).subscribe({
        next: (res: any) => {
          if (res?.logoImg?.body?.url) {
            this.logoImg['file'] = null;
            this.logoImg['url'] = res?.logoImg?.body?.url;
          }

          if (res?.coverImg?.body?.url) {
            this.coverImg['file'] = null;
            this.coverImg['url'] = res?.coverImg?.body?.url;
          }

          this.spinner.hide();
          this.onSubmit();
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
    } else {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.spinner.show();
    if (this.communityDetails.CommunityName && this.communityDetails.slug && this.logoImg?.url && this.coverImg?.url) {
      this.communityDetails.profileId = this.profileId;
      this.communityDetails.logoImg = this.logoImg?.url;
      this.communityDetails.coverImg = this.coverImg?.url;
      if (this.communityDetails) {
        this.communityService.createCommunity(this.communityDetails).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (!res.error) {
                this.submitted = true;
                this.createCommunityAdmin(res.data);
                this.toaster.success('Your Local Community will be approved withing 24 hours!');
                this.activeModal.close('success');
              }
            },
            error:
              (err) => {
                this.toaster.danger('Please change community name. this community name already in use.');
                this.spinner.hide();
              }
          });
      }
    } else {
      this.spinner.hide();
      this.toaster.danger('Please enter mandatory fields(*) data.');
    }
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

  onCommunityNameChange(): void {
    this.communityDetails.slug = slugify(this.communityDetails.CommunityName);
  }

  onLogoImgChange(event: any): void {
    this.logoImg = event;
  }

  onCoverImgChange(event: any): void {
    this.coverImg = event;
  }
}
