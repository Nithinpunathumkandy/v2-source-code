import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditScheduleChecklistComponent } from './ms-audit-schedule-checklist.component';

describe('MsAuditScheduleChecklistComponent', () => {
  let component: MsAuditScheduleChecklistComponent;
  let fixture: ComponentFixture<MsAuditScheduleChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditScheduleChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditScheduleChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
