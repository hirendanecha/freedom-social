import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-research-card',
  templateUrl: './research-card.component.html',
  styleUrls: ['./research-card.component.scss']
})
export class ResearchCardComponent {

  constructor(
    private router: Router
  ) {}

  openResearchPost(): void {
    this.router.navigate(['/', 'research', 'post', 123]);
  }
}
