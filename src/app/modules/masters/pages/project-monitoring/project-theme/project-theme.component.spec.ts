import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectThemeComponent } from './project-theme.component';

describe('ProjectThemeComponent', () => {
  let component: ProjectThemeComponent;
  let fixture: ComponentFixture<ProjectThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
