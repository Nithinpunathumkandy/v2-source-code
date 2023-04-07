import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPlanDetailsComponent } from './am-audit-plan-details.component';

describe('AmAuditPlanDetailsComponent', () => {
  let component: AmAuditPlanDetailsComponent;
  let fixture: ComponentFixture<AmAuditPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
