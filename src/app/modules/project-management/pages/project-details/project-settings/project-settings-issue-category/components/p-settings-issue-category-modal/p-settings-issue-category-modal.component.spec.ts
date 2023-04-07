import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsIssueCategoryModalComponent } from './project-settings-issue-category-modal.component';

describe('ProjectSettingsIssueCategoryModalComponent', () => {
  let component: ProjectSettingsIssueCategoryModalComponent;
  let fixture: ComponentFixture<ProjectSettingsIssueCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsIssueCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsIssueCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
