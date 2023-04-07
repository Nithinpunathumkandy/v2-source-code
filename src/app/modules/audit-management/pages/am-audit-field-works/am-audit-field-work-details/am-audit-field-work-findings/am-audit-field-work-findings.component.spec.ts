import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkFindingsComponent } from './am-audit-field-work-findings.component';

describe('AmAuditFieldWorkFindingsComponent', () => {
  let component: AmAuditFieldWorkFindingsComponent;
  let fixture: ComponentFixture<AmAuditFieldWorkFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorkFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorkFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
