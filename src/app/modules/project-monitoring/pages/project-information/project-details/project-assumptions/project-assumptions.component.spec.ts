import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssumptionsComponent } from './project-assumptions.component';

describe('ProjectAssumptionsComponent', () => {
  let component: ProjectAssumptionsComponent;
  let fixture: ComponentFixture<ProjectAssumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAssumptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
