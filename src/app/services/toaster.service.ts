import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any = [];

  // show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
  //   this.toasts.push({ textOrTpl, ...options });
  // }

  success(msg: string) {
    this.toasts.push({ textOrTpl: msg, classname: 'bg-success text-light' });
  }

  danger(msg: string) {
    this.toasts.push({ textOrTpl: msg, classname: 'bg-danger text-light' });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
