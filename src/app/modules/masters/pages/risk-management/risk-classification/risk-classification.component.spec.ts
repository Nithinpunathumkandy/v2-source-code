import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskClassificationComponent } from './risk-classification.component';

describe('RiskClassificationComponent', () => {
  let component: RiskClassificationComponent;
  let fixture: ComponentFixture<RiskClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
