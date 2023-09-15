import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { filter, map } from 'rxjs';
import { BreakpointService } from '../@shared/services/breakpoint.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { RightSidebarComponent } from '../main-layout/components/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from '../main-layout/components/left-sidebar/left-sidebar.component';
import { ResearchSidebarComponent } from '../main-layout/components/research-sidebar/research-sidebar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {

  showButton = false;
  sidebar: any = {
    isShowLeftSideBar: true,
    isShowRightSideBar: true,
    isShowResearchLeftSideBar: false,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
    public breakpointService: BreakpointService,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof Scroll),
      map(() => {
        let child = this.route.firstChild;

        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (Object.keys(child?.snapshot?.data)?.length > 0) {
            return child.snapshot.data;
          } else {
            return {};
          }
        }

        return {};
      }),
    ).subscribe((data: any) => {
      console.log(data);
      this.sidebar = data;
    });
  }

  openLeftSidebar() {
		this.offcanvasService.open(this.sidebar?.isShowResearchLeftSideBar ? ResearchSidebarComponent : LeftSidebarComponent, { position: 'start', panelClass: 'w-300-px' });
	}

  openRightSidebar() {
		this.offcanvasService.open(RightSidebarComponent, { position: 'end', panelClass: 'w-300-px' });
	}
}
