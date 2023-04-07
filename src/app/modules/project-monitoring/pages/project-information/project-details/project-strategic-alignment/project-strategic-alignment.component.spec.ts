import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStrategicAlignmentComponent } from './project-strategic-alignment.component';

describe('ProjectStrategicAlignmentComponent', () => {
  let component: ProjectStrategicAlignmentComponent;
  let fixture: ComponentFixture<ProjectStrategicAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectStrategicAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStrategicAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
