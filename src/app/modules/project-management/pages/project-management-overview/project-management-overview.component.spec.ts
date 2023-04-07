import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementOverviewComponent } from './project-management-overview.component';

describe('ProjectManagementOverviewComponent', () => {
  let component: ProjectManagementOverviewComponent;
  let fixture: ComponentFixture<ProjectManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
