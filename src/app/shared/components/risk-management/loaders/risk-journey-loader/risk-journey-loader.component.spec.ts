import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskJourneyLoaderComponent } from './risk-journey-loader.component';

describe('RiskJourneyLoaderComponent', () => {
  let component: RiskJourneyLoaderComponent;
  let fixture: ComponentFixture<RiskJourneyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskJourneyLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskJourneyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
