import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCountTypeComponent } from './project-count-type.component';

describe('ProjectCountTypeComponent', () => {
  let component: ProjectCountTypeComponent;
  let fixture: ComponentFixture<ProjectCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
