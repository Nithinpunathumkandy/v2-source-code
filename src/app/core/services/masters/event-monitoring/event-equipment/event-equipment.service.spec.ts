import { TestBed } from '@angular/core/testing';

import { EventEquipmentService } from './event-equipment.service';

describe('EventEquipmentService', () => {
  let service: EventEquipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventEquipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
