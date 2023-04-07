import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixPlanListComponent } from './maturity-matrix-plan-list.component';

describe('MaturityMatrixPlanListComponent', () => {
  let component: MaturityMatrixPlanListComponent;
  let fixture: ComponentFixture<MaturityMatrixPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
