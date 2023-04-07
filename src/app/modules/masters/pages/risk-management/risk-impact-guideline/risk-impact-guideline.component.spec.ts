import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskImpactGuidelineComponent } from './risk-impact-guideline.component';

describe('RiskImpactGuidelineComponent', () => {
  let component: RiskImpactGuidelineComponent;
  let fixture: ComponentFixture<RiskImpactGuidelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskImpactGuidelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskImpactGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
