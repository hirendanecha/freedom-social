import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../services/customer.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tag-user-input',
  templateUrl: './tag-user-input.component.html',
  styleUrls: ['./tag-user-input.component.scss']
})
export class TagUserInputComponent implements OnChanges, OnDestroy {

  @Input('value') value: string = '';
  @Output('onDataChange') onDataChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tagInputDiv', { static: false }) tagInputDiv: ElementRef;
  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown }) userSearchNgbDropdown: NgbDropdown;

  ngUnsubscribe: Subject<void> = new Subject<void>();
  metaDataSubject: Subject<void> = new Subject<void>();

  userList = [];
  userNameSearch = '';
  metaData: any = {};

  constructor(
    private renderer: Renderer2,
    private customerService: CustomerService,
    private postService: PostService,
    private spinner: NgxSpinnerService,
  ) {
    this.metaDataSubject.pipe(debounceTime(300)).subscribe(() => {
      this.getMetaDataFromUrlStr();
      this.checkUserTagFlag();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setTagInputDivValue(changes.value.currentValue);

    if (changes.value.currentValue === '') {
      this.clearUserSearchData();
      this.clearMetaData();
    } else {
      this.getMetaDataFromUrlStr();
      this.checkUserTagFlag();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.metaDataSubject.next();
    this.metaDataSubject.complete();
  }

  messageOnKeyEvent(): void {
    this.metaDataSubject.next();
    this.emitChangeEvent();
  }

  checkUserTagFlag(): void {
    const htmlText = this.tagInputDiv.nativeElement.innerHTML;

    const atSymbolIndex = htmlText.lastIndexOf('@');

    if (atSymbolIndex !== -1) {
      this.userNameSearch = htmlText.substring(atSymbolIndex + 1);
      if (this.userNameSearch?.length > 2) {
        this.getUserList(this.userNameSearch);
      } else {
        this.clearUserSearchData();
      }
    } else {
      this.clearUserSearchData();
    }
  }

  getMetaDataFromUrlStr(): void {
    const htmlText = this.tagInputDiv.nativeElement.innerHTML;

    const matches = htmlText.match(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/gi);

    const url = matches?.[0];
    console.log('url : ', url);

    if (url) {
      if (!url?.includes(this.metaData?.url)) {
        this.spinner.show();
        this.ngUnsubscribe.next();

        this.postService
          .getMetaData({ url })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (res: any) => {
              if (res?.meta?.image) {
                const urls = res.meta?.image?.url;
                const imgUrl = Array.isArray(urls) ? urls?.[0] : urls;

                this.metaData = {
                  title: res?.meta?.title,
                  metadescription: res?.meta?.description,
                  metaimage: imgUrl,
                  metalink: res?.meta?.url || url,
                  url: url,
                };

                this.emitChangeEvent();
              }

              this.spinner.hide();
            },
            error: () => {
              this.clearMetaData();
              this.spinner.hide();
            },
          });
      }
    } else {
      this.clearMetaData();
    }
  }

  selectTagUser(user: any): void {
    const postHtml = this.tagInputDiv.nativeElement.innerHTML;
    const text = postHtml.replace(
      `@${this.userNameSearch}`,
      `<a href="/settings/view-profile/${user?.Id}" class="text-warning" data-id="${user?.Id}">@${user?.Username}</a>`
    );
    this.setTagInputDivValue(text);

    this.emitChangeEvent();
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
    this.userSearchNgbDropdown?.close();
  }

  clearMetaData(): void {
    this.metaData = {};
    this.emitChangeEvent();
  }

  setTagInputDivValue(htmlText: string): void {
    if (this.tagInputDiv) {
      this.renderer.setProperty(
        this.tagInputDiv.nativeElement,
        'innerHTML',
        htmlText
      );
    }
  }

  emitChangeEvent(): void {
    if (this.tagInputDiv) {
      this.onDataChange.emit({
        html: this.tagInputDiv.nativeElement.innerHTML,
        tags: this.tagInputDiv?.nativeElement?.children,
        meta: this.metaData,
      });
    }
  }
}
