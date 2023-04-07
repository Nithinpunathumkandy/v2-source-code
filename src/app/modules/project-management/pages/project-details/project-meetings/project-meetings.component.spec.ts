import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMeetingsComponent } from './project-meetings.component';

describe('ProjectMeetingsComponent', () => {
  let component: ProjectMeetingsComponent;
  let fixture: ComponentFixture<ProjectMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectMeetingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
