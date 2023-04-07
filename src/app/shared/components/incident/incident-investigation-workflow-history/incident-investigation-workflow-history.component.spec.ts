import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInvestigationWorkflowHistoryComponent } from './incident-investigation-workflow-history.component';

describe('IncidentInvestigationWorkflowHistoryComponent', () => {
  let component: IncidentInvestigationWorkflowHistoryComponent;
  let fixture: ComponentFixture<IncidentInvestigationWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInvestigationWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInvestigationWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
