import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighAvailabilityStatusComponent } from './high-availability-status.component';

describe('HighAvailabilityStatusComponent', () => {
  let component: HighAvailabilityStatusComponent;
  let fixture: ComponentFixture<HighAvailabilityStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighAvailabilityStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighAvailabilityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
