import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistAnswersModalComponent } from './checklist-answers-modal.component';

describe('ChecklistAnswersModalComponent', () => {
  let component: ChecklistAnswersModalComponent;
  let fixture: ComponentFixture<ChecklistAnswersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistAnswersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAnswersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
