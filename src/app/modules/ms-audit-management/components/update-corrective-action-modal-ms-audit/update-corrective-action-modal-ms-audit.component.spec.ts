import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCorrectiveActionModalMsAuditComponent } from './update-corrective-action-modal-ms-audit.component';

describe('UpdateCorrectiveActionModalMsAuditComponent', () => {
  let component: UpdateCorrectiveActionModalMsAuditComponent;
  let fixture: ComponentFixture<UpdateCorrectiveActionModalMsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCorrectiveActionModalMsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCorrectiveActionModalMsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
