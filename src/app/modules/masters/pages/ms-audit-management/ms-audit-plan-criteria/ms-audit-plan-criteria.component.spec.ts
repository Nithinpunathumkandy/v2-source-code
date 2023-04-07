import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditPlanCriteriaComponent } from './ms-audit-plan-criteria.component';

describe('MsAuditPlanCriteriaComponent', () => {
  let component: MsAuditPlanCriteriaComponent;
  let fixture: ComponentFixture<MsAuditPlanCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditPlanCriteriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditPlanCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
