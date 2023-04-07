import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDiscussionComponent } from './project-discussion.component';

describe('ProjectDiscussionComponent', () => {
  let component: ProjectDiscussionComponent;
  let fixture: ComponentFixture<ProjectDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
