import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorkflowEngineComponent } from './event-workflow-engine.component';

describe('EventWorkflowEngineComponent', () => {
  let component: EventWorkflowEngineComponent;
  let fixture: ComponentFixture<EventWorkflowEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorkflowEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorkflowEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
