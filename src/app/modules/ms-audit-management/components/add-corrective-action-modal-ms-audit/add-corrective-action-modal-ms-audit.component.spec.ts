import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrectiveActionModalMsAuditComponent } from './add-corrective-action-modal-ms-audit.component';

describe('AddCorrectiveActionModalMsAuditComponent', () => {
  let component: AddCorrectiveActionModalMsAuditComponent;
  let fixture: ComponentFixture<AddCorrectiveActionModalMsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCorrectiveActionModalMsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrectiveActionModalMsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
