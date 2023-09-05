import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research-card',
  templateUrl: './research-card.component.html',
  styleUrls: ['./research-card.component.scss']
})
export class ResearchCardComponent implements AfterViewInit {

  @Input('post') post: any;

  constructor(
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    console.log('post :', this.post);
  }

  openResearchPost(): void {
    this.router.navigate(['/', 'research', 'post', this.post?.postToProfileID]);
  }
}
