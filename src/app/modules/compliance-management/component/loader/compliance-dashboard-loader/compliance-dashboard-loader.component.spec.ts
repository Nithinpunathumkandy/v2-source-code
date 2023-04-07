import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDashboardLoaderComponent } from './compliance-dashboard-loader.component';

describe('ComplianceDashboardLoaderComponent', () => {
  let component: ComplianceDashboardLoaderComponent;
  let fixture: ComponentFixture<ComplianceDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
