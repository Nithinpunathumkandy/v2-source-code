import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskConfigurationComponent } from './risk-configuration.component';

describe('RiskConfigurationComponent', () => {
  let component: RiskConfigurationComponent;
  let fixture: ComponentFixture<RiskConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
