import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiReportLoaderComponent } from './kpi-report-loader.component';

describe('KpiReportLoaderComponent', () => {
  let component: KpiReportLoaderComponent;
  let fixture: ComponentFixture<KpiReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
