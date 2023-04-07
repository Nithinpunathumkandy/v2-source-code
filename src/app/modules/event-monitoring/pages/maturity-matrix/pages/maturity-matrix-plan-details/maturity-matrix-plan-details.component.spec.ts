import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixPlanDetailsComponent } from './maturity-matrix-plan-details.component';

describe('MaturityMatrixPlanDetailsComponent', () => {
  let component: MaturityMatrixPlanDetailsComponent;
  let fixture: ComponentFixture<MaturityMatrixPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
