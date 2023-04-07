import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIssueStatusComponent } from './project-issue-status.component';

describe('ProjectIssueStatusComponent', () => {
  let component: ProjectIssueStatusComponent;
  let fixture: ComponentFixture<ProjectIssueStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectIssueStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIssueStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
