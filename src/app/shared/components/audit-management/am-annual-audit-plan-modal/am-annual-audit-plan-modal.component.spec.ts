import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAnnualAuditPlanModalComponent } from './am-annual-audit-plan-modal.component';

describe('AmAnnualAuditPlanModalComponent', () => {
  let component: AmAnnualAuditPlanModalComponent;
  let fixture: ComponentFixture<AmAnnualAuditPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAnnualAuditPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAnnualAuditPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
