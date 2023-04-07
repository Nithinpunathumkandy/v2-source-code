import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditMeetingDetailsComponent } from './am-audit-meeting-details.component';

describe('AmAuditMeetingDetailsComponent', () => {
  let component: AmAuditMeetingDetailsComponent;
  let fixture: ComponentFixture<AmAuditMeetingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditMeetingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditMeetingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
