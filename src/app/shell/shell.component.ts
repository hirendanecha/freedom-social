import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {

  showButton = false;
  sidebar: any = {
    isShowLeftSideBar: true,
    isShowRightSideBar: true,
    isShowResearchLeftSideBar: false,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute
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
}
