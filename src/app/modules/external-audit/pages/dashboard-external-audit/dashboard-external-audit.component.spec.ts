import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExternalAuditComponent } from './dashboard-external-audit.component';

describe('DashboardExternalAuditComponent', () => {
  let component: DashboardExternalAuditComponent;
  let fixture: ComponentFixture<DashboardExternalAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardExternalAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExternalAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
