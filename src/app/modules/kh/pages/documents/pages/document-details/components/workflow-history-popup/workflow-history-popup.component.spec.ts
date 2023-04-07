import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowHistoryPopupComponent } from './workflow-history-popup.component';

describe('WorkflowHistoryPopupComponent', () => {
  let component: WorkflowHistoryPopupComponent;
  let fixture: ComponentFixture<WorkflowHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowHistoryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
