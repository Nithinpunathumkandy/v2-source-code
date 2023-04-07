import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLessonLearntCaComponent } from './add-lesson-learnt-ca.component';

describe('AddLessonLearntCaComponent', () => {
  let component: AddLessonLearntCaComponent;
  let fixture: ComponentFixture<AddLessonLearntCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLessonLearntCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLessonLearntCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
