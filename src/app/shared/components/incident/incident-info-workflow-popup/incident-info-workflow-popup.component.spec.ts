import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentInfoWorkflowPopupComponent } from './incident-info-workflow-popup.component';

describe('IncidentInfoWorkflowPopupComponent', () => {
  let component: IncidentInfoWorkflowPopupComponent;
  let fixture: ComponentFixture<IncidentInfoWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentInfoWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentInfoWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
