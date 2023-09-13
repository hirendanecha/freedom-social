import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from 'src/app/@shared/services/community.service';
import { ToastService } from 'src/app/@shared/services/toaster.service';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent {

  @Input('community') community: any = {}
  @Input('type') type: string = '';
  @Output('getCommunities') getCommunities: EventEmitter<void> = new EventEmitter<void>();

  profileId: number = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private communityService: CommunityService,
    private toaster: ToastService
  ) {
    this.profileId = Number(sessionStorage.getItem('profileId'));
  }

  goToCommunityDetailPage(): void {
    if (this.community?.isApprove === 'Y') {
      this.router.navigate(['community', this.community?.slug]);
    } else {
      this.toaster.danger('This community not approve yet.');
    }
  }

  joinCommunity(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    const data = {
      profileId: this.profileId,
      communityId: this.community.Id,
      IsActive: 'Y',
    };

    this.communityService.joinCommunity(data).subscribe({
      next: (res: any) => {
        if (res) {
          this.goToCommunityDetailPage();
        }
      }
    });
  }

  deleteOrLeaveCommunity(event: any): void {
    event.stopPropagation();
    event.preventDefault();

    let actionType = '';
    let actionObs = null;
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    if (this.type === 'my') {
      actionType = 'Delete';
      actionObs = this.communityService.deleteCommunity(this.community?.Id);
    } else {
      actionType = 'Leave';
      actionObs = this.communityService.removeFromCommunity(this.community?.Id, this.profileId);
    }

    modalRef.componentInstance.title = `${actionType} Community`;
    modalRef.componentInstance.confirmButtonLabel = actionType;
    modalRef.componentInstance.message = `Are you sure want to ${actionType.toLowerCase()} this community?`;

    modalRef.result.then((res) => {
      if (res === 'success') {

        actionObs.subscribe({
          next: (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.getCommunities?.emit();
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
