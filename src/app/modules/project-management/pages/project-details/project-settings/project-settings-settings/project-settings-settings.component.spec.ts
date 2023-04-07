import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsSettingsComponent } from './project-settings-settings.component';

describe('ProjectSettingsSettingsComponent', () => {
  let component: ProjectSettingsSettingsComponent;
  let fixture: ComponentFixture<ProjectSettingsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSettingsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
