import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskOverviewLoaderComponent } from './risk-overview-loader.component';

describe('RiskOverviewLoaderComponent', () => {
  let component: RiskOverviewLoaderComponent;
  let fixture: ComponentFixture<RiskOverviewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskOverviewLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskOverviewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
