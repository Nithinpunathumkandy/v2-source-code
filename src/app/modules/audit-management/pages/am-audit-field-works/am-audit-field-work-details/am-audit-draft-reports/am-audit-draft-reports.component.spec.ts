import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDraftReportsComponent } from './am-audit-draft-reports.component';

describe('AmAuditDraftReportsComponent', () => {
  let component: AmAuditDraftReportsComponent;
  let fixture: ComponentFixture<AmAuditDraftReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDraftReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDraftReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
