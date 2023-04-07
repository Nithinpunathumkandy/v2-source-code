import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChangeRequestStatusComponent } from './project-change-request-status.component';

describe('ProjectChangeRequestStatusComponent', () => {
  let component: ProjectChangeRequestStatusComponent;
  let fixture: ComponentFixture<ProjectChangeRequestStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectChangeRequestStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectChangeRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
