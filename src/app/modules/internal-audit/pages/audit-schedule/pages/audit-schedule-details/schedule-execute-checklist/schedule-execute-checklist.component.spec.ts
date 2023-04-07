import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleExecuteChecklistComponent } from './schedule-execute-checklist.component';

describe('ScheduleExecuteChecklistComponent', () => {
  let component: ScheduleExecuteChecklistComponent;
  let fixture: ComponentFixture<ScheduleExecuteChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleExecuteChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleExecuteChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
