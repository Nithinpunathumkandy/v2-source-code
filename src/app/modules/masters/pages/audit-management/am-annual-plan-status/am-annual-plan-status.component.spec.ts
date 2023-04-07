import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAnnualPlanStatusComponent } from './am-annual-plan-status.component';

describe('AmAnnualPlanStatusComponent', () => {
  let component: AmAnnualPlanStatusComponent;
  let fixture: ComponentFixture<AmAnnualPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAnnualPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAnnualPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
