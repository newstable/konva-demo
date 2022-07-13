import { TestBed, inject } from '@angular/core/testing';

import { KonvaService } from './konva.service';

describe('KonvaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KonvaService]
    });
  });

  it('should be created', inject([KonvaService], (service: KonvaService) => {
    expect(service).toBeTruthy();
  }));
});
