import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRolesModalComponent } from './project-roles-modal.component';

describe('ProjectRolesModalComponent', () => {
  let component: ProjectRolesModalComponent;
  let fixture: ComponentFixture<ProjectRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectRolesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
