import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDiscussionModalComponent } from './project-discussion-modal.component';

describe('ProjectDiscussionModalComponent', () => {
  let component: ProjectDiscussionModalComponent;
  let fixture: ComponentFixture<ProjectDiscussionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDiscussionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDiscussionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
