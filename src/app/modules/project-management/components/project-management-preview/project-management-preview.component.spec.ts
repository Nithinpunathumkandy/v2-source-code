import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementPreviewComponent } from './project-management-preview.component';

describe('ProjectManagementPreviewComponent', () => {
  let component: ProjectManagementPreviewComponent;
  let fixture: ComponentFixture<ProjectManagementPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
