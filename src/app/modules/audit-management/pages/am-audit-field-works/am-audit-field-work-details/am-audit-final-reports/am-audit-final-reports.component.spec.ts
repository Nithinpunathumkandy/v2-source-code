import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFinalReportsComponent } from './am-audit-final-reports.component';

describe('AmAuditFinalReportsComponent', () => {
  let component: AmAuditFinalReportsComponent;
  let fixture: ComponentFixture<AmAuditFinalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFinalReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFinalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
