import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectClosureStatusComponent } from './project-closure-status.component';

describe('ProjectClosureStatusComponent', () => {
  let component: ProjectClosureStatusComponent;
  let fixture: ComponentFixture<ProjectClosureStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectClosureStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectClosureStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
