import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuidtableItemsForPlanScheduleComponent } from './auidtable-items-for-plan-schedule.component';

describe('AuidtableItemsForPlanScheduleComponent', () => {
  let component: AuidtableItemsForPlanScheduleComponent;
  let fixture: ComponentFixture<AuidtableItemsForPlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuidtableItemsForPlanScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuidtableItemsForPlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
