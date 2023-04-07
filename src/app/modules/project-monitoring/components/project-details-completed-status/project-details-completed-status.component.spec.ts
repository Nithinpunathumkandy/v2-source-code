import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsCompletedStatusComponent } from './project-details-completed-status.component';

describe('ProjectDetailsCompletedStatusComponent', () => {
  let component: ProjectDetailsCompletedStatusComponent;
  let fixture: ComponentFixture<ProjectDetailsCompletedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsCompletedStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsCompletedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
