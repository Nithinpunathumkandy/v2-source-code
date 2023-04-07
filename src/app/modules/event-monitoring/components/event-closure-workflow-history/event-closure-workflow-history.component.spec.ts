import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureWorkflowHistoryComponent } from './event-closure-workflow-history.component';

describe('EventClosureWorkflowHistoryComponent', () => {
  let component: EventClosureWorkflowHistoryComponent;
  let fixture: ComponentFixture<EventClosureWorkflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureWorkflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureWorkflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
