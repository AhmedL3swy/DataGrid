import { TestBed } from '@angular/core/testing';

import { FakeDataServiceService } from './fake-data-service.service';

describe('FakeDataServiceService', () => {
  let service: FakeDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
