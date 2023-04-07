import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorAuditeeAddModalComponent } from './auditor-auditee-add-modal.component';

describe('AuditorAuditeeAddModalComponent', () => {
  let component: AuditorAuditeeAddModalComponent;
  let fixture: ComponentFixture<AuditorAuditeeAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorAuditeeAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorAuditeeAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
