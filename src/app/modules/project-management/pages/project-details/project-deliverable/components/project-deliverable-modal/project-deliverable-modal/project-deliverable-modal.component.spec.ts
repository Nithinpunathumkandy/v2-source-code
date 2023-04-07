import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeliverableModalComponent } from './project-deliverable-modal.component';

describe('ProjectDeliverableModalComponent', () => {
  let component: ProjectDeliverableModalComponent;
  let fixture: ComponentFixture<ProjectDeliverableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDeliverableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeliverableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
