import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskControlPlanModalComponent } from './risk-control-plan-modal.component';

describe('RiskControlPlanModalComponent', () => {
  let component: RiskControlPlanModalComponent;
  let fixture: ComponentFixture<RiskControlPlanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskControlPlanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskControlPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
