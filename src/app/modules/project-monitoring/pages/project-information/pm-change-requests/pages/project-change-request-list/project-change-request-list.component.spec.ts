import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeRequestListComponent } from './project-change-request-list.component';

describe('ProjectChangeRequestListComponent', () => {
  let component: ProjectChangeRequestListComponent;
  let fixture: ComponentFixture<ProjectChangeRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
