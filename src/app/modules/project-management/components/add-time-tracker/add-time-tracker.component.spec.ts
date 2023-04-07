import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeTrackerComponent } from './add-time-tracker.component';

describe('AddTimeTrackerComponent', () => {
  let component: AddTimeTrackerComponent;
  let fixture: ComponentFixture<AddTimeTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimeTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimeTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
