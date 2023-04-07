import { TestBed } from '@angular/core/testing';

import { EventStrategicThemesService } from './event-strategic-themes.service';

describe('EventStrategicThemesService', () => {
  let service: EventStrategicThemesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventStrategicThemesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
