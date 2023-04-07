import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowDesiginationAddComponent } from './incident-workflow-desigination-add.component';

describe('IncidentWorkflowDesiginationAddComponent', () => {
  let component: IncidentWorkflowDesiginationAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowDesiginationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowDesiginationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowDesiginationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
