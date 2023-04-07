import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPhaseComponent } from './task-phase.component';

describe('TaskPhaseComponent', () => {
  let component: TaskPhaseComponent;
  let fixture: ComponentFixture<TaskPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
