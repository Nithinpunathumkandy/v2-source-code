import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetailsDashboardComponent } from './kpi-details-dashboard.component';

describe('KpiDetailsDashboardComponent', () => {
  let component: KpiDetailsDashboardComponent;
  let fixture: ComponentFixture<KpiDetailsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiDetailsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
