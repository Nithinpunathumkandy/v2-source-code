import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsCategoryComponent } from './project-settings-category.component';

describe('ProjectSettingsCategoryComponent', () => {
  let component: ProjectSettingsCategoryComponent;
  let fixture: ComponentFixture<ProjectSettingsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
