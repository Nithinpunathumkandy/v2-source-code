import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiActitvityLogsComponent } from './kpi-actitvity-logs.component';

describe('KpiActitvityLogsComponent', () => {
  let component: KpiActitvityLogsComponent;
  let fixture: ComponentFixture<KpiActitvityLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiActitvityLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiActitvityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
