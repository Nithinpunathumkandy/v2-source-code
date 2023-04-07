import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackKeyComponent } from './app-feedback-key.component';

describe('AppFeedbackKeyComponent', () => {
  let component: AppFeedbackKeyComponent;
  let fixture: ComponentFixture<AppFeedbackKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppFeedbackKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeedbackKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
