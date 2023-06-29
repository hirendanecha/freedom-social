import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  isEXpand = false;
  isShowPeoplePages = false;
  isFriendRequest = false;
  isBlockList = false;
  isSuggesation = false;
  isAllFriends = false;
  isEvents = false;
  isHome = false;
  isCommunity = false;
  isPageResearch = false;
  isSetting = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.url.includes('/home') || false;
        this.isShowPeoplePages = event.url.includes('/people') || false;
        this.isAllFriends = event.url.includes('/people/all-friends') || false;
        this.isBlockList = event.url.includes('/block-list') || false;
        this.isSuggesation = event.url.includes('/suggesation') || false;
        this.isFriendRequest = event.url.includes('/friend-request') || false;
        this.isEvents = event.url.includes('/events') || false;
        this.isCommunity = event.url.includes('/community') || false;
        this.isPageResearch = event.url.includes('/favorite') || false;
        this.isSetting = event.url.includes('/settings') || false;
      }
    })
    // if (this.route.snapshot.url === '/people') {
    //   this.isShowPeoplePages = true;
    // } else {
    //   this.isShowPeoplePages = false;
    //   console.log(this.isShowPeoplePages);
    // }
  }

  openToggle() {
    this.isEXpand = !this.isEXpand;
  }
}
