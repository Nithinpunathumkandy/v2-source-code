import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditTestPlanModalComponent } from './am-audit-test-plan-modal.component';

describe('AmAuditTestPlanModalComponent', () => {
  let component: AmAuditTestPlanModalComponent;
  let fixture: ComponentFixture<AmAuditTestPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditTestPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditTestPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
