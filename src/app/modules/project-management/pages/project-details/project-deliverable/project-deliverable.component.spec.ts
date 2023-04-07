import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeliverableComponent } from './project-deliverable.component';

describe('ProjectDeliverableComponent', () => {
  let component: ProjectDeliverableComponent;
  let fixture: ComponentFixture<ProjectDeliverableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDeliverableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
