import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatrixPlanComponent } from './add-matrix-plan.component';

describe('AddMatrixPlanComponent', () => {
  let component: AddMatrixPlanComponent;
  let fixture: ComponentFixture<AddMatrixPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMatrixPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMatrixPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
