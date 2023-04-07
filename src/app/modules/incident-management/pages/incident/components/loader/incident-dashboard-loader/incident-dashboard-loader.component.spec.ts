import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDashboardLoaderComponent } from './incident-dashboard-loader.component';

describe('IncidentDashboardLoaderComponent', () => {
  let component: IncidentDashboardLoaderComponent;
  let fixture: ComponentFixture<IncidentDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
