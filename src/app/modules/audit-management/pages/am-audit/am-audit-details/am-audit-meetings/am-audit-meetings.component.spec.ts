import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditMeetingsComponent } from './am-audit-meetings.component';

describe('AmAuditMeetingsComponent', () => {
  let component: AmAuditMeetingsComponent;
  let fixture: ComponentFixture<AmAuditMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
