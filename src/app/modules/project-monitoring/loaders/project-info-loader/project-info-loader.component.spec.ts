import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInfoLoaderComponent } from './project-info-loader.component';

describe('ProjectInfoLoaderComponent', () => {
  let component: ProjectInfoLoaderComponent;
  let fixture: ComponentFixture<ProjectInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
