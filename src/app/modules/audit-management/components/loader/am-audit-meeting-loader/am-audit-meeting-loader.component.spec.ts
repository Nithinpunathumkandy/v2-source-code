import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditMeetingLoaderComponent } from './am-audit-meeting-loader.component';

describe('AmAuditMeetingLoaderComponent', () => {
  let component: AmAuditMeetingLoaderComponent;
  let fixture: ComponentFixture<AmAuditMeetingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditMeetingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditMeetingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
