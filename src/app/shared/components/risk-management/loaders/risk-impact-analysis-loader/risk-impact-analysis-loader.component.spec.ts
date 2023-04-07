import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskImpactAnalysisLoaderComponent } from './risk-impact-analysis-loader.component';

describe('RiskImpactAnalysisLoaderComponent', () => {
  let component: RiskImpactAnalysisLoaderComponent;
  let fixture: ComponentFixture<RiskImpactAnalysisLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskImpactAnalysisLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskImpactAnalysisLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
