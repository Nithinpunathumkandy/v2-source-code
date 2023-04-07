import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowAddModdelComponent } from './incident-workflow-add-moddel.component';

describe('IncidentWorkflowAddModdelComponent', () => {
  let component: IncidentWorkflowAddModdelComponent;
  let fixture: ComponentFixture<IncidentWorkflowAddModdelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowAddModdelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowAddModdelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
