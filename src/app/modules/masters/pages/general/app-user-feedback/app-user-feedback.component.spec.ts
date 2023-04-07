import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserFeedbackComponent } from './app-user-feedback.component';

describe('AppUserFeedbackComponent', () => {
  let component: AppUserFeedbackComponent;
  let fixture: ComponentFixture<AppUserFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUserFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
