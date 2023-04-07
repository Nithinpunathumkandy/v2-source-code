import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowTeamAddComponent } from './incident-workflow-team-add.component';

describe('IncidentWorkflowTeamAddComponent', () => {
  let component: IncidentWorkflowTeamAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowTeamAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowTeamAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowTeamAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
