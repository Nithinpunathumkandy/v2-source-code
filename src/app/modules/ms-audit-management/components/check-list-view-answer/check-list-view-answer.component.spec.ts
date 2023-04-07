import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListViewAnswerComponent } from './check-list-view-answer.component';

describe('CheckListViewAnswerComponent', () => {
  let component: CheckListViewAnswerComponent;
  let fixture: ComponentFixture<CheckListViewAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckListViewAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListViewAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
