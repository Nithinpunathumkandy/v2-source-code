import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTestPlanStatusModalComponent } from './audit-test-plan-status-modal.component';

describe('AuditTestPlanStatusModalComponent', () => {
  let component: AuditTestPlanStatusModalComponent;
  let fixture: ComponentFixture<AuditTestPlanStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTestPlanStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTestPlanStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
