import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSubmitPopupComponent } from './workflow-submit-popup.component';

describe('WorkflowSubmitPopupComponent', () => {
  let component: WorkflowSubmitPopupComponent;
  let fixture: ComponentFixture<WorkflowSubmitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowSubmitPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSubmitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
