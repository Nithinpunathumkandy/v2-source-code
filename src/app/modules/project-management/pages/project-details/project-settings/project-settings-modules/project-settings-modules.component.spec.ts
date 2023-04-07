import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsModulesComponent } from './project-settings-modules.component';

describe('ProjectSettingsModulesComponent', () => {
  let component: ProjectSettingsModulesComponent;
  let fixture: ComponentFixture<ProjectSettingsModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
