import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureWorkflowComponent } from './event-closure-workflow.component';

describe('EventClosureWorkflowComponent', () => {
  let component: EventClosureWorkflowComponent;
  let fixture: ComponentFixture<EventClosureWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
