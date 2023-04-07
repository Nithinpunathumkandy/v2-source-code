import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerDetailsComponent } from './time-tracker-details.component';

describe('TimeTrackerDetailsComponent', () => {
  let component: TimeTrackerDetailsComponent;
  let fixture: ComponentFixture<TimeTrackerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeTrackerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
