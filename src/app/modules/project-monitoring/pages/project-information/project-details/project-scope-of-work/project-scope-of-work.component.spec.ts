import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScopeOfWorkComponent } from './project-scope-of-work.component';

describe('ProjectScopeOfWorkComponent', () => {
  let component: ProjectScopeOfWorkComponent;
  let fixture: ComponentFixture<ProjectScopeOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectScopeOfWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectScopeOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
