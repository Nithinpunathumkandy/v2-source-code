import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiImprovementPlanStatusesComponent } from './kpi-improvement-plan-statuses.component';

describe('KpiImprovementPlanStatusesComponent', () => {
  let component: KpiImprovementPlanStatusesComponent;
  let fixture: ComponentFixture<KpiImprovementPlanStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiImprovementPlanStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiImprovementPlanStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
