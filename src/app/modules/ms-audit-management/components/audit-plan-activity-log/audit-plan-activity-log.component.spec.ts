import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanActivityLogComponent } from './audit-plan-activity-log.component';

describe('AuditPlanActivityLogComponent', () => {
  let component: AuditPlanActivityLogComponent;
  let fixture: ComponentFixture<AuditPlanActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditPlanActivityLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPlanActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
