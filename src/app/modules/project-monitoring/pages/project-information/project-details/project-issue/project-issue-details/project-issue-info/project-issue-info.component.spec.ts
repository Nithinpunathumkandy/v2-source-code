import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIssueInfoComponent } from './project-issue-info.component';

describe('ProjectIssueInfoComponent', () => {
  let component: ProjectIssueInfoComponent;
  let fixture: ComponentFixture<ProjectIssueInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectIssueInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIssueInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
