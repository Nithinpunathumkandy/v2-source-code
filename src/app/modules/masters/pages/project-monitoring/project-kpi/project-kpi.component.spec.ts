import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKpiComponent } from './project-kpi.component';

describe('ProjectKpiComponent', () => {
  let component: ProjectKpiComponent;
  let fixture: ComponentFixture<ProjectKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectKpiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
