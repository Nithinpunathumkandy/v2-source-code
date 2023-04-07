import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackSmileyComponent } from './app-feedback-smiley.component';

describe('AppFeedbackSmileyComponent', () => {
  let component: AppFeedbackSmileyComponent;
  let fixture: ComponentFixture<AppFeedbackSmileyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFeedbackSmileyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeedbackSmileyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
