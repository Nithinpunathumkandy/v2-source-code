import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPriorityModalComponent } from './project-priority-modal.component';

describe('ProjectPriorityModalComponent', () => {
  let component: ProjectPriorityModalComponent;
  let fixture: ComponentFixture<ProjectPriorityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPriorityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPriorityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
