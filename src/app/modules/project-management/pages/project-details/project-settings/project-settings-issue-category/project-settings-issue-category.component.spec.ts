import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsIssueCategoryComponent } from './project-settings-issue-category.component';

describe('ProjectSettingsIssueCategoryComponent', () => {
  let component: ProjectSettingsIssueCategoryComponent;
  let fixture: ComponentFixture<ProjectSettingsIssueCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsIssueCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsIssueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
