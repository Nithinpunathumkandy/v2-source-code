import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonLearntCaComponent } from './lesson-learnt-ca.component';

describe('LessonLearntCaComponent', () => {
  let component: LessonLearntCaComponent;
  let fixture: ComponentFixture<LessonLearntCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LessonLearntCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonLearntCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
