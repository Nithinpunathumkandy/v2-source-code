import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementMappingComponent } from './project-management-mapping.component';

describe('ProjectManagementMappingComponent', () => {
  let component: ProjectManagementMappingComponent;
  let fixture: ComponentFixture<ProjectManagementMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
