import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistAddAnswerComponent } from './checklist-add-answer.component';

describe('ChecklistAddAnswerComponent', () => {
  let component: ChecklistAddAnswerComponent;
  let fixture: ComponentFixture<ChecklistAddAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistAddAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAddAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
