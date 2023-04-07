import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditScheduleDetailsComponent } from './audit-schedule-details.component';

describe('AuditScheduleDetailsComponent', () => {
  let component: AuditScheduleDetailsComponent;
  let fixture: ComponentFixture<AuditScheduleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditScheduleDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditScheduleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
