import { TestBed } from '@angular/core/testing';

import { ErrorRecordService } from './error-record.service';

describe('ErrorRecordService', () => {
  let service: ErrorRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
