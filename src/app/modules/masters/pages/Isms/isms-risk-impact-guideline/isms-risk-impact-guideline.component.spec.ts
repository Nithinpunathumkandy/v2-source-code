import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskImpactGuidelineComponent } from './isms-risk-impact-guideline.component';

describe('IsmsRiskImpactGuidelineComponent', () => {
  let component: IsmsRiskImpactGuidelineComponent;
  let fixture: ComponentFixture<IsmsRiskImpactGuidelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskImpactGuidelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskImpactGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
