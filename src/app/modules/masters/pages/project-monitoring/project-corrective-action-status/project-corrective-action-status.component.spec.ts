import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCorrectiveActionStatusComponent } from './project-corrective-action-status.component';

describe('ProjectCorrectiveActionStatusComponent', () => {
  let component: ProjectCorrectiveActionStatusComponent;
  let fixture: ComponentFixture<ProjectCorrectiveActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCorrectiveActionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCorrectiveActionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
