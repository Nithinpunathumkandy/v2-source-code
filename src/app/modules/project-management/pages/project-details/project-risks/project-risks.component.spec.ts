import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRisksComponent } from './project-risks.component';

describe('ProjectRisksComponent', () => {
  let component: ProjectRisksComponent;
  let fixture: ComponentFixture<ProjectRisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectRisksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
