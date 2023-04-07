import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimeTrackerDetailsComponent } from './project-time-tracker-details.component';

describe('ProjectTimeTrackerDetailsComponent', () => {
  let component: ProjectTimeTrackerDetailsComponent;
  let fixture: ComponentFixture<ProjectTimeTrackerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTimeTrackerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimeTrackerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
