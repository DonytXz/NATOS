import { TestBed } from '@angular/core/testing';

import { TarimasService } from './tarimas.service';

describe('TarimasService', () => {
  let service: TarimasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarimasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
