import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditDashboardLoaderComponent } from './ms-audit-dashboard-loader.component';

describe('MsAuditDashboardLoaderComponent', () => {
  let component: MsAuditDashboardLoaderComponent;
  let fixture: ComponentFixture<MsAuditDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
