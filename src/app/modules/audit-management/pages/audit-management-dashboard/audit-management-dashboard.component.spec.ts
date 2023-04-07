import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementDashboardComponent } from './audit-management-dashboard.component';

describe('AuditManagementDashboardComponent', () => {
  let component: AuditManagementDashboardComponent;
  let fixture: ComponentFixture<AuditManagementDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
