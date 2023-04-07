import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStrategicAlignmentLoaderComponent } from './project-strategic-alignment-loader.component';

describe('ProjectStrategicAlignmentLoaderComponent', () => {
  let component: ProjectStrategicAlignmentLoaderComponent;
  let fixture: ComponentFixture<ProjectStrategicAlignmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStrategicAlignmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStrategicAlignmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
