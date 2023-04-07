import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSendPopupComponent } from './mail-send-popup.component';

describe('MailSendPopupComponent', () => {
  let component: MailSendPopupComponent;
  let fixture: ComponentFixture<MailSendPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailSendPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSendPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
