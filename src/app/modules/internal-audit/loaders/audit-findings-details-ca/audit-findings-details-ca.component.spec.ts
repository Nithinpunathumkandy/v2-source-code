import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsDetailsCAComponent } from './audit-findings-details-ca.component';

describe('AuditFindingsDetailsCAComponent', () => {
  let component: AuditFindingsDetailsCAComponent;
  let fixture: ComponentFixture<AuditFindingsDetailsCAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingsDetailsCAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsDetailsCAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
