import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectObjectiveComponent } from './project-objective.component';

describe('ProjectObjectiveComponent', () => {
  let component: ProjectObjectiveComponent;
  let fixture: ComponentFixture<ProjectObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectObjectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
