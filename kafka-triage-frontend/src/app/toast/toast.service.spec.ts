import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastServiceService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should add toasts to be shown.', () => {
    service.show('toast1', 'toastBody');
    expect(service.toasts).toContain({ header: 'toast1', body: 'toastBody' });
  });

  it('should add toasts with error to be shown.', () => {
    service.showError('toast1');
    expect(service.toasts).toContain({ header: 'ERROR', body: 'toast1' });
  });

  it('should remove toasts.', () => {
    const toast = { header: 'toast1', body: 'toastBody' };
    service.toasts = [toast];

    service.remove(toast);

    expect(service.toasts).toHaveSize(0);
  });
});
