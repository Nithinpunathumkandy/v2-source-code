import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOutInscopeComponent } from './project-out-inscope.component';

describe('ProjectOutInscopeComponent', () => {
  let component: ProjectOutInscopeComponent;
  let fixture: ComponentFixture<ProjectOutInscopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectOutInscopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOutInscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
