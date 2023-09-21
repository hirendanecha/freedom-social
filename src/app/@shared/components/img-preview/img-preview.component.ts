import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.scss']
})
export class ImgPreviewComponent {

  @Input('src') src: string;
  @Input('classes') classes: string = 'w-40-px h-40-px';

  previewSrc: string = '';
}
