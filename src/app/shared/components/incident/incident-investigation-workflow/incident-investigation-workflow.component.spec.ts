import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInvestigationWorkflowComponent } from './incident-investigation-workflow.component';

describe('IncidentInvestigationWorkflowComponent', () => {
  let component: IncidentInvestigationWorkflowComponent;
  let fixture: ComponentFixture<IncidentInvestigationWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInvestigationWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInvestigationWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
