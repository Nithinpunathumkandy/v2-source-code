import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmRiskAnalysisComponent } from './bpm-risk-analysis.component';

describe('BpmRiskAnalysisComponent', () => {
  let component: BpmRiskAnalysisComponent;
  let fixture: ComponentFixture<BpmRiskAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmRiskAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmRiskAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
