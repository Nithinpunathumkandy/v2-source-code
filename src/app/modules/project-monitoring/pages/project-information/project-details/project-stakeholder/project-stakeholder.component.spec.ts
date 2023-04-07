import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStakeholderComponent } from './project-stakeholder.component';

describe('ProjectStakeholderComponent', () => {
  let component: ProjectStakeholderComponent;
  let fixture: ComponentFixture<ProjectStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStakeholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
