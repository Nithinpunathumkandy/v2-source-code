import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentWorkflowHistoryComponent } from './cyber-incident-workflow-history.component';

describe('CyberIncidentWorkflowHistoryComponent', () => {
  let component: CyberIncidentWorkflowHistoryComponent;
  let fixture: ComponentFixture<CyberIncidentWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
