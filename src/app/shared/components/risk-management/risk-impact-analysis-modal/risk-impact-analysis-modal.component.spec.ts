import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskImpactAnalysisModalComponent } from './risk-impact-analysis-modal.component';

describe('RiskImpactAnalysisModalComponent', () => {
  let component: RiskImpactAnalysisModalComponent;
  let fixture: ComponentFixture<RiskImpactAnalysisModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskImpactAnalysisModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskImpactAnalysisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
