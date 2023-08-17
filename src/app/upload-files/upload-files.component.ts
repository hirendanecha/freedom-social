import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
  @Input() events: Observable<void>;
  @Input() reset: boolean;
  @Input() passDefaultImg: any;
  @Input() isDisable: any;
  @Input() type: any;
  @Input() isProfile: any;

  @Output() onImageUpload = new EventEmitter();
  private eventsSubscription: Subscription;

  selectedFiles: FileList;
  defaultFile: File;
  progressInfos = [];
  message = '';
  id = '';
  pid: any = 'new';
  files: any = null;
  isSelected = false;
  @ViewChild('inputField') inputField: ElementRef<any>;

  fileInfos: Observable<any>;
  private destroy$ = new Subject<void>();

  constructor(
    private uploadService: UploadFilesService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.pid = window.sessionStorage.user_id;
    this.eventsSubscription = this.events.subscribe((res) => {
      this.pid = res;
    });
    // this.fileInfos = this.uploadService.getFiles();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.fileInfos = null;
    }
    if (changes['reset'] && !changes['reset'].currentValue) {
      this.files = null;
      this.inputField.nativeElement.file = undefined;
      this.selectedFiles = undefined;
    }
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.defaultFile = undefined;
    // if (this.selectedFiles.length) {
    //   if (!this.isProfile) {
    //     this.message = this.upload(this.selectedFiles, 'false');
    //   } else {
    //   }
    // }
    this.message = this.upload(this.selectedFiles, this.type);
  }

  upload(file, defaultType): any {
    if (file.size / (1024 * 1024) > 5) {
      return 'Image file size exceeds 5 MB!';
    }

    this.spinner.show();
    this.uploadService.upload(file[0], this.pid, defaultType).subscribe(
      (res: any) => {
        // if (event.type === HttpEventType.UploadProgress) {
        //   this.spinner.hide();
        // } else if (event instanceof HttpResponse) {
        //   this.spinner.hide();
        //   this.selectedFiles = undefined;
        //   this.cd.detectChanges();
        //   // this.sharedService.getProfilePic();
        // }
        if (res.body) {
          this.spinner.hide();
          this.sharedService.profilePic = res?.body?.url;
        }
      },
      (err) => {
        this.spinner.hide();
        this.selectedFiles = undefined;
        return 'Could not upload the file:' + file.name;
      }
    );
  }

  ngOnDestroy() {
    this.eventsSubscription?.unsubscribe();
  }
}
