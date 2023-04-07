import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditPreliminaryReportsComponent } from './am-audit-preliminary-reports.component';

describe('AmAuditPreliminaryReportsComponent', () => {
  let component: AmAuditPreliminaryReportsComponent;
  let fixture: ComponentFixture<AmAuditPreliminaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditPreliminaryReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditPreliminaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
