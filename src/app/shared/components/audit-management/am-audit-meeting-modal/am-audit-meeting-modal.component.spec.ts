import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditMeetingModalComponent } from './am-audit-meeting-modal.component';

describe('AmAuditMeetingModalComponent', () => {
  let component: AmAuditMeetingModalComponent;
  let fixture: ComponentFixture<AmAuditMeetingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditMeetingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditMeetingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
