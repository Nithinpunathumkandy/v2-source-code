import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentWorkflowHeadUnitAddComponent } from './incident-workflow-head-unit-add.component';

describe('IncidentWorkflowHeadUnitAddComponent', () => {
  let component: IncidentWorkflowHeadUnitAddComponent;
  let fixture: ComponentFixture<IncidentWorkflowHeadUnitAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentWorkflowHeadUnitAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentWorkflowHeadUnitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
