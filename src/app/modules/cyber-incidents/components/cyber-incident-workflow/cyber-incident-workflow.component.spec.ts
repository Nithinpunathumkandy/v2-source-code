import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentWorkflowComponent } from './cyber-incident-workflow.component';

describe('CyberIncidentWorkflowComponent', () => {
  let component: CyberIncidentWorkflowComponent;
  let fixture: ComponentFixture<CyberIncidentWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
