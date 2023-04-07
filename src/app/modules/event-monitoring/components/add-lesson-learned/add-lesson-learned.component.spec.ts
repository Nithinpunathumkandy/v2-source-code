import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonLearnedComponent } from './add-lesson-learned.component';

describe('AddLessonLearnedComponent', () => {
  let component: AddLessonLearnedComponent;
  let fixture: ComponentFixture<AddLessonLearnedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLessonLearnedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLessonLearnedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
