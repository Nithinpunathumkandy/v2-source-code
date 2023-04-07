import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowHistoryModalComponent } from './workflow-history-modal.component';

describe('WorkflowHistoryModalComponent', () => {
  let component: WorkflowHistoryModalComponent;
  let fixture: ComponentFixture<WorkflowHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
