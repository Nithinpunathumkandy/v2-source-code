import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditManagementOverviewComponent } from './ms-audit-management-overview.component';

describe('MsAuditManagementOverviewComponent', () => {
  let component: MsAuditManagementOverviewComponent;
  let fixture: ComponentFixture<MsAuditManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
