import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimeCategoryComponent } from './project-time-category.component';

describe('ProjectTimeCategoryComponent', () => {
  let component: ProjectTimeCategoryComponent;
  let fixture: ComponentFixture<ProjectTimeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTimeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
