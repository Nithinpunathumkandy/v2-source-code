import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlanCriteriaModalComponent } from './ms-audit-plan-criteria-modal.component';

describe('MsAuditPlanCriteriaModalComponent', () => {
  let component: MsAuditPlanCriteriaModalComponent;
  let fixture: ComponentFixture<MsAuditPlanCriteriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlanCriteriaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlanCriteriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
