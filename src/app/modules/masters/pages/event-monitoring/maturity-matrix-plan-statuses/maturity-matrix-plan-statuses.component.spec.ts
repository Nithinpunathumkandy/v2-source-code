import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixPlanStatusesComponent } from './maturity-matrix-plan-statuses.component';

describe('MaturityMatrixPlanStatusesComponent', () => {
  let component: MaturityMatrixPlanStatusesComponent;
  let fixture: ComponentFixture<MaturityMatrixPlanStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixPlanStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixPlanStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
