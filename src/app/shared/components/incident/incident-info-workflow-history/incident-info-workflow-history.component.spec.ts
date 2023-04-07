import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInfoWorkflowHistoryComponent } from './incident-info-workflow-history.component';

describe('IncidentInfoWorkflowHistoryComponent', () => {
  let component: IncidentInfoWorkflowHistoryComponent;
  let fixture: ComponentFixture<IncidentInfoWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInfoWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInfoWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
