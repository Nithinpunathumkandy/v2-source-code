import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCaWorkflowHistoryComponent } from './incident-ca-workflow-history.component';

describe('IncidentCaWorkflowHistoryComponent', () => {
  let component: IncidentCaWorkflowHistoryComponent;
  let fixture: ComponentFixture<IncidentCaWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCaWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCaWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
