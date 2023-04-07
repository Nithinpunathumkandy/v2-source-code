import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaLoaderMsAuditFindingsComponent } from './rca-loader-ms-audit-findings.component';

describe('RcaLoaderMsAuditFindingsComponent', () => {
  let component: RcaLoaderMsAuditFindingsComponent;
  let fixture: ComponentFixture<RcaLoaderMsAuditFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaLoaderMsAuditFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaLoaderMsAuditFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
