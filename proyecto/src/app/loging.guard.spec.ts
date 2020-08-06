import { TestBed } from '@angular/core/testing';

import { LogingGuard } from './loging.guard';

describe('LogingGuard', () => {
  let guard: LogingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
