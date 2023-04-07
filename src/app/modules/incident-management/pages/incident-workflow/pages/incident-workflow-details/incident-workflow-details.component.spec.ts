import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowDetailsComponent } from './incident-workflow-details.component';

describe('IncidentWorkflowDetailsComponent', () => {
  let component: IncidentWorkflowDetailsComponent;
  let fixture: ComponentFixture<IncidentWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
