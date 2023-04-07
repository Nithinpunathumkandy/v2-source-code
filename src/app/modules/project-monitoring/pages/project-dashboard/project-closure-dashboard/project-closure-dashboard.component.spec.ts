import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectClosureDashboardComponent } from './project-closure-dashboard.component';

describe('ProjectClosureDashboardComponent', () => {
  let component: ProjectClosureDashboardComponent;
  let fixture: ComponentFixture<ProjectClosureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectClosureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectClosureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
