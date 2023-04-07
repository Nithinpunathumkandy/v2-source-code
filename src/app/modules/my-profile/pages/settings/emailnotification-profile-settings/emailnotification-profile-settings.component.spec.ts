import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailnotificationProfileSettingsComponent } from './emailnotification-profile-settings.component';

describe('EmailnotificationProfileSettingsComponent', () => {
  let component: EmailnotificationProfileSettingsComponent;
  let fixture: ComponentFixture<EmailnotificationProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailnotificationProfileSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailnotificationProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
