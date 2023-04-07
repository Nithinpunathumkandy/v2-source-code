import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualPlanComponent } from './annual-plan.component';

describe('AnnualPlanComponent', () => {
  let component: AnnualPlanComponent;
  let fixture: ComponentFixture<AnnualPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
