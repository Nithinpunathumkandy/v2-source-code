import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditDashboardComponent } from './external-audit-dashboard.component';

describe('ExternalAuditDashboardComponent', () => {
  let component: ExternalAuditDashboardComponent;
  let fixture: ComponentFixture<ExternalAuditDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalAuditDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
