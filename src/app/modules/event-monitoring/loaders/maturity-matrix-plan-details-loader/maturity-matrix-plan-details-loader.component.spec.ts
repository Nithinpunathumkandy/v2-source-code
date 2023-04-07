import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixPlanDetailsLoaderComponent } from './maturity-matrix-plan-details-loader.component';

describe('MaturityMatrixPlanDetailsLoaderComponent', () => {
  let component: MaturityMatrixPlanDetailsLoaderComponent;
  let fixture: ComponentFixture<MaturityMatrixPlanDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixPlanDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixPlanDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
