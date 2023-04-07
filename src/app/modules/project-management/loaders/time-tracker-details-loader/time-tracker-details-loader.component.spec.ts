import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerDetailsLoaderComponent } from './time-tracker-details-loader.component';

describe('TimeTrackerDetailsLoaderComponent', () => {
  let component: TimeTrackerDetailsLoaderComponent;
  let fixture: ComponentFixture<TimeTrackerDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeTrackerDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackerDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
