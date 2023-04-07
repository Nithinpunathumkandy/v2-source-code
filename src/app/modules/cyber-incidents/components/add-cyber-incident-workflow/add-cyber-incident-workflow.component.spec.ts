import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCyberIncidentWorkflowComponent } from './add-cyber-incident-workflow.component';

describe('AddCyberIncidentWorkflowComponent', () => {
  let component: AddCyberIncidentWorkflowComponent;
  let fixture: ComponentFixture<AddCyberIncidentWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCyberIncidentWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCyberIncidentWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
