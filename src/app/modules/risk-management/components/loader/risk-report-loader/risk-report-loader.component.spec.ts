import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReportLoaderComponent } from './risk-report-loader.component';

describe('RiskReportLoaderComponent', () => {
  let component: RiskReportLoaderComponent;
  let fixture: ComponentFixture<RiskReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
