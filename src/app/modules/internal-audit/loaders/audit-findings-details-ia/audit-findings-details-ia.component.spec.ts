import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsDetailsIAComponent } from './audit-findings-details-ia.component';

describe('AuditFindingsDetailsIAComponent', () => {
  let component: AuditFindingsDetailsIAComponent;
  let fixture: ComponentFixture<AuditFindingsDetailsIAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingsDetailsIAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsDetailsIAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
