import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceActionPlanStatusComponent } from './compliance-action-plan-status.component';

describe('ComplianceActionPlanStatusComponent', () => {
  let component: ComplianceActionPlanStatusComponent;
  let fixture: ComponentFixture<ComplianceActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
