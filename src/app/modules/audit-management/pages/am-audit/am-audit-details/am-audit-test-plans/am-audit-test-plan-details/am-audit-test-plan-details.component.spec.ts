import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditTestPlanDetailsComponent } from './am-audit-test-plan-details.component';

describe('AmAuditTestPlanDetailsComponent', () => {
  let component: AmAuditTestPlanDetailsComponent;
  let fixture: ComponentFixture<AmAuditTestPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditTestPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditTestPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
