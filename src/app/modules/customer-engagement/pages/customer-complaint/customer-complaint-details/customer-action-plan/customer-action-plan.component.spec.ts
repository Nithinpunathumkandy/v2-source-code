import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActionPlanComponent } from './customer-action-plan.component';

describe('CustomerActionPlanComponent', () => {
  let component: CustomerActionPlanComponent;
  let fixture: ComponentFixture<CustomerActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
