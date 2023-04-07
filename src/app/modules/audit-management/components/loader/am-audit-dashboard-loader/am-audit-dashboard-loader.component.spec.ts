import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDashboardLoaderComponent } from './am-audit-dashboard-loader.component';

describe('AmAuditDashboardLoaderComponent', () => {
  let component: AmAuditDashboardLoaderComponent;
  let fixture: ComponentFixture<AmAuditDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
