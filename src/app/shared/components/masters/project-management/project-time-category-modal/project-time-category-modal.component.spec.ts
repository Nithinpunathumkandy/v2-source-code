import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimeCategoryModalComponent } from './project-time-category-modal.component';

describe('ProjectTimeCategoryModalComponent', () => {
  let component: ProjectTimeCategoryModalComponent;
  let fixture: ComponentFixture<ProjectTimeCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTimeCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimeCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
