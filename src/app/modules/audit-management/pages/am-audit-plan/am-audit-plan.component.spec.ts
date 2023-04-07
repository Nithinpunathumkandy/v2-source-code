import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanComponent } from './am-audit-plan.component';

describe('AmAuditPlanComponent', () => {
  let component: AmAuditPlanComponent;
  let fixture: ComponentFixture<AmAuditPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
