import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualAuditPlanInfoComponent } from './individual-audit-plan-info.component';

describe('IndividualAuditPlanInfoComponent', () => {
  let component: IndividualAuditPlanInfoComponent;
  let fixture: ComponentFixture<IndividualAuditPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualAuditPlanInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualAuditPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
