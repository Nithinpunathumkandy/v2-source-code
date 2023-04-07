import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskWeightageComponent } from './project-task-weightage.component';

describe('ProjectTaskWeightageComponent', () => {
  let component: ProjectTaskWeightageComponent;
  let fixture: ComponentFixture<ProjectTaskWeightageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTaskWeightageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskWeightageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
