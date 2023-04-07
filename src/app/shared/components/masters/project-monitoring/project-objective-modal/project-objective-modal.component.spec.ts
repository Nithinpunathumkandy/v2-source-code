import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectObjectiveModalComponent } from './project-objective-modal.component';

describe('ProjectObjectiveModalComponent', () => {
  let component: ProjectObjectiveModalComponent;
  let fixture: ComponentFixture<ProjectObjectiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectObjectiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
