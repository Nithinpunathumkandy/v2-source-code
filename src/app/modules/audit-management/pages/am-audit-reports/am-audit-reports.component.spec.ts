import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditReportsComponent } from './am-audit-reports.component';

describe('AmAuditReportsComponent', () => {
  let component: AmAuditReportsComponent;
  let fixture: ComponentFixture<AmAuditReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
