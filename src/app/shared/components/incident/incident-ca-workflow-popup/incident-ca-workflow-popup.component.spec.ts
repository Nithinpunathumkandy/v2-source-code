import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCaWorkflowPopupComponent } from './incident-ca-workflow-popup.component';

describe('IncidentCaWorkflowPopupComponent', () => {
  let component: IncidentCaWorkflowPopupComponent;
  let fixture: ComponentFixture<IncidentCaWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCaWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCaWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
