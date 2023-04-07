import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTestPlanStatusComponent } from './audit-test-plan-status.component';

describe('AuditTestPlanStatusComponent', () => {
  let component: AuditTestPlanStatusComponent;
  let fixture: ComponentFixture<AuditTestPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditTestPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTestPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
