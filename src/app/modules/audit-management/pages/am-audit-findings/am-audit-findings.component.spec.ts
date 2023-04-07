import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFindingsComponent } from './am-audit-findings.component';

describe('AmAuditFindingsComponent', () => {
  let component: AmAuditFindingsComponent;
  let fixture: ComponentFixture<AmAuditFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
