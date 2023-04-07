import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskJourneyComponent } from './isms-risk-journey.component';

describe('IsmsRiskJourneyComponent', () => {
  let component: IsmsRiskJourneyComponent;
  let fixture: ComponentFixture<IsmsRiskJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
