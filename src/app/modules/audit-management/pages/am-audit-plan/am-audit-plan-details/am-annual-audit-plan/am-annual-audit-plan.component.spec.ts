import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAnnualAuditPlanComponent } from './am-annual-audit-plan.component';

describe('AmAnnualAuditPlanComponent', () => {
  let component: AmAnnualAuditPlanComponent;
  let fixture: ComponentFixture<AmAnnualAuditPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAnnualAuditPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAnnualAuditPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
