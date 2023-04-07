import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskImpactGuidelineModalComponent } from './isms-risk-impact-guideline-modal.component';

describe('IsmsRiskImpactGuidelineModalComponent', () => {
  let component: IsmsRiskImpactGuidelineModalComponent;
  let fixture: ComponentFixture<IsmsRiskImpactGuidelineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskImpactGuidelineModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskImpactGuidelineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
