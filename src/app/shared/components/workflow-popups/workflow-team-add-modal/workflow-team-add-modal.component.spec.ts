import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTeamAddModalComponent } from './workflow-team-add-modal.component';

describe('WorkflowTeamAddModalComponent', () => {
  let component: WorkflowTeamAddModalComponent;
  let fixture: ComponentFixture<WorkflowTeamAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowTeamAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowTeamAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
