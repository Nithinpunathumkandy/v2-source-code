import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistAnswerModalComponent } from './checklist-answer-modal.component';

describe('ChecklistAnswerModalComponent', () => {
  let component: ChecklistAnswerModalComponent;
  let fixture: ComponentFixture<ChecklistAnswerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistAnswerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAnswerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
