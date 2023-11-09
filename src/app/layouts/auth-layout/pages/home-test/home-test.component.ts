import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home-test',
  templateUrl: './home-test.component.html',
  styleUrls: ['./home-test.component.scss'],
})

export class HomeTestComponent {
  constructor() {}

  handleClick() {
    // Your click event handler code here
    console.log('Button clicked!');
  }
}
