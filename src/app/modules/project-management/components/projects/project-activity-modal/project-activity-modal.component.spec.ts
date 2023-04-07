import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActivityModalComponent } from './project-activity-modal.component';

describe('ProjectActivityModalComponent', () => {
  let component: ProjectActivityModalComponent;
  let fixture: ComponentFixture<ProjectActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectActivityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
