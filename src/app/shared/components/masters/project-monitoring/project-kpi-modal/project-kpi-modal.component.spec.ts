import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKpiModalComponent } from './project-kpi-modal.component';

describe('ProjectKpiModalComponent', () => {
  let component: ProjectKpiModalComponent;
  let fixture: ComponentFixture<ProjectKpiModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectKpiModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectKpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
