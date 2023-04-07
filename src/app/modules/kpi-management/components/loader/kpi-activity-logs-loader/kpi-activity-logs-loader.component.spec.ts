import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiActivityLogsLoaderComponent } from './kpi-activity-logs-loader.component';

describe('KpiActivityLogsLoaderComponent', () => {
  let component: KpiActivityLogsLoaderComponent;
  let fixture: ComponentFixture<KpiActivityLogsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiActivityLogsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiActivityLogsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
