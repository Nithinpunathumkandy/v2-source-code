import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditSummaryComponent } from './am-audit-summary.component';

describe('AmAuditSummaryComponent', () => {
  let component: AmAuditSummaryComponent;
  let fixture: ComponentFixture<AmAuditSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
