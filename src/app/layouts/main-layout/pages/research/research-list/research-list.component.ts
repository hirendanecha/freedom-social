import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { PostService } from 'src/app/@shared/services/post.service';
import { ProfileService } from 'src/app/@shared/services/profile.service';
import { SharedService } from 'src/app/@shared/services/shared.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { deleteExtraParamsFromReqObj, isFormSubmittedAndError, numToRevArray } from 'src/app/@shared/utils/utils';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.scss']
})
export class ResearchListComponent {

  researches: any = [];
  btnGroupFeedTypeCtrl: FormControl;
  btnGroupViewTypeCtrl: FormControl;

  groupPosts: any = [];
  pagination: any = {
    page: 0,
    limit: 0,
    limitArray: []
  };
  isGroupPostsLoader: boolean = false;

  tagInputDefaultData: string = '';
  researchForm = new FormGroup({
    posttoprofileid: new FormControl('', [Validators.required]),
    textpostdesc: new FormControl(''),
    postdescription: new FormControl('', [Validators.required]),
    keywords: new FormControl(''),
    posttype: new FormControl('R'),
    meta: new FormControl({}),
    isClicked: new FormControl(false),
    isSubmitted: new FormControl(false),
  });

  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private breakpointService: BreakpointService,
    private toastService: ToastService,
  ) {
    this.btnGroupFeedTypeCtrl = new FormControl('All');
    this.btnGroupViewTypeCtrl = new FormControl('TopStories');

    this.breakpointService.screen.subscribe((res) => {
      if (res.sm.lessThen && this.pagination.limit !== 1) {
        this.pagination = {
          page: 7,
          limit: 1,
          limitArray: numToRevArray(1)
        };

        this.groupsAndPosts();
      } else if (res.md.lessThen && this.pagination.limit !== 2) {
        this.pagination = {
          page: 4,
          limit: 2,
          limitArray: numToRevArray(2)
        };

        this.groupsAndPosts();
      } else if (res.md.gatherThen && this.pagination.limit !== 3) {
        this.pagination = {
          page: 3,
          limit: 3,
          limitArray: numToRevArray(3)
        };

        this.groupsAndPosts();
      }
    });

    this.getGroups();
  }

  get formIsClicked(): FormControl {
    return this.researchForm.get('isClicked') as FormControl;
  }

  get formIsSubmitted(): FormControl {
    return this.researchForm.get('isSubmitted') as FormControl;
  }

  onTagUserInputChangeEvent(data: any, ctrlName: string): void {
    this.researchForm.get(ctrlName).setValue(data?.html);
    this.researchForm.get('meta').setValue(data?.meta || {});
    console.log('data : ', data);

    // this.postData.postdescription = data?.html;
    // this.postMessageTags = data?.tags;
  }

  groupsAndPosts(): void {
    this.isGroupPostsLoader = true;

    this.profileService.groupsAndPosts().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.groupPosts = res;
        }
      },
      error: (err) => {
        this.groupPosts = [];
      },
      complete: () => {
        this.isGroupPostsLoader = false;
      }
    });
  }

  getGroups(): void {
    this.spinner.show();

    this.profileService.getGroups().subscribe({
      next: (res: any) => {
        if (res?.length > 0) {
          this.researches = res;
        }
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      }
    });
  }

  getNextPageGroupPostsById(event: NgbSlideEvent, group: any): void {
    if (event.source === 'arrowRight') {
      if (!group?.page) {
        group['page'] = this.pagination.page;
      } else {
        group.page += 1;
      }

      this.profileService.getGroupPostById(group?.Id, group?.page, this.pagination.limit).subscribe({
        next: (res: any) => {
          if (res?.length > 0) {
            group.posts = [...group.posts, ...res];
          }
        }
      });
    }
  }

  createResearch(): void {
    this.formIsClicked.setValue(true);
    if (this.researchForm.invalid && this.formIsSubmitted.value === false) {
      this.toastService.danger('Please enter mandatory fields(*) data.');
      return;
    } else {
      this.formIsSubmitted.setValue(true);
      const reqObj = deleteExtraParamsFromReqObj(this.researchForm.value);
      const meta = {...reqObj['meta']};
      delete reqObj['meta'];
      reqObj['profileId'] = localStorage.getItem('profileId');
      reqObj['title'] = meta?.title;
      reqObj['metadescription'] = meta?.metadescription;
      reqObj['metaimage'] = meta?.metaimage;
      reqObj['metalink'] = meta?.metalink;
      console.log('reqObj : ', reqObj);

      this.postService.createPost(reqObj).subscribe({
        next: (res) => {
          if (res) {
            console.log('res : ', res);
            this.toastService.success('Research added successfully.');
            this.groupsAndPosts();
          } else {
            this.toastService.danger(res['message']);
          }
        },
        error: (error: any) => {
          this.toastService.danger(error.message);
        }
      }).add(() => {
        this.researchForm.reset();
        this.tagInputDefaultData = 'reset';
        setTimeout(() => {
          this.tagInputDefaultData = '';
        }, 100);
        this.formIsClicked.setValue(false);
        this.formIsSubmitted.setValue(false);
      });
    }
  }

  isFormSubmittedAndError(controlName: string, errorName: string = '', notError: Array<string> = new Array()): any {
    return isFormSubmittedAndError(this.researchForm, this.formIsClicked.value, controlName, errorName, notError);
  }
}
