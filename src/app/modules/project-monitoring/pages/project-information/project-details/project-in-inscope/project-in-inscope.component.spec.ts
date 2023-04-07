import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInInscopeComponent } from './project-in-inscope.component';

describe('ProjectInInscopeComponent', () => {
  let component: ProjectInInscopeComponent;
  let fixture: ComponentFixture<ProjectInInscopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectInInscopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInInscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
