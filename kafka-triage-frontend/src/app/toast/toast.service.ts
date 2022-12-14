import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: any[] = [];

  show(header: string, body: string) {
    this.toasts.push({ header, body });
  }

  showError(body: string) {
    this.show('ERROR', body);
  }

  showSuccess(body: string) {
    this.show('SUCCESS', body);
  }

  showInfo(body: string) {
    this.show('INFO', body);
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t != toast);
  }
}
