import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPopupModalComponent } from './workflow-popup-modal.component';

describe('WorkflowPopupModalComponent', () => {
  let component: WorkflowPopupModalComponent;
  let fixture: ComponentFixture<WorkflowPopupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowPopupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowPopupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
