import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskControlPlanComponent } from './risk-control-plan.component';

describe('RiskControlPlanComponent', () => {
  let component: RiskControlPlanComponent;
  let fixture: ComponentFixture<RiskControlPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskControlPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskControlPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
