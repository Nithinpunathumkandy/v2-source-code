import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskImpactGuidelineModalComponent } from './risk-impact-guideline-modal.component';

describe('RiskImpactGuidelineModalComponent', () => {
  let component: RiskImpactGuidelineModalComponent;
  let fixture: ComponentFixture<RiskImpactGuidelineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskImpactGuidelineModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskImpactGuidelineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
