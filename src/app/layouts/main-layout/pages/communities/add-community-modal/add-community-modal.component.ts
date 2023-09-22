import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { slugify } from 'src/app/@shared/utils/utils';
import { Community } from 'src/app/@shared/constant/customer';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-community-modal',
  templateUrl: './add-community-modal.component.html',
  styleUrls: ['./add-community-modal.component.scss'],
})
export class AddCommunityModalComponent {
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
    private toastService: ToastService
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
      this.communityDetails.pageType = 'community'
      if (this.communityDetails) {
        this.communityService.createCommunity(this.communityDetails).subscribe(
          {
            next: (res: any) => {
              this.spinner.hide();
              if (!res.error) {
                this.submitted = true;
                this.createCommunityAdmin(res.data);
                this.toastService.success('Your Local Community will be approved within 24 hours!');
                this.activeModal.close('success');
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
