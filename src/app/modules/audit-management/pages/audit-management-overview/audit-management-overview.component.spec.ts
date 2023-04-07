import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementOverviewComponent } from './audit-management-overview.component';

describe('AuditManagementOverviewComponent', () => {
  let component: AuditManagementOverviewComponent;
  let fixture: ComponentFixture<AuditManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
