import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHlPlanComponent } from './project-hl-plan.component';

describe('ProjectHlPlanComponent', () => {
  let component: ProjectHlPlanComponent;
  let fixture: ComponentFixture<ProjectHlPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectHlPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectHlPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
