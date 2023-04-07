import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCountListComponent } from './project-count-list.component';

describe('ProjectCountListComponent', () => {
  let component: ProjectCountListComponent;
  let fixture: ComponentFixture<ProjectCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
