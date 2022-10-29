import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

describe('ToastComponentComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastElement: any;
  const toastService = jasmine.createSpyObj('ToastService', ['show', 'remove']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent, NgbToast],
      providers: [{ provide: ToastService, useValue: toastService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toastElement = fixture.nativeElement.querySelector('.bottom-center');
  });

  it('Should not display toasts if there are none.', () => {
    toastService.toasts = [];
    fixture.detectChanges();
    expect(toastElement.querySelector('ngb-toast')).toBe(null);
  });

  it('Should display toasts if there are.', () => {
    toastService.toasts = [
      { header: 'toast1', body: 'toast' },
      { header: 'toast2', body: 'toast' },
    ];
    fixture.detectChanges();
    expect(toastElement.querySelectorAll('ngb-toast')).toHaveSize(2);
  });
});
