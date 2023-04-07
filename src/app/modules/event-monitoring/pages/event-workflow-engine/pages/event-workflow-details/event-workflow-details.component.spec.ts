import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorkflowDetailsComponent } from './event-workflow-details.component';

describe('EventWorkflowDetailsComponent', () => {
  let component: EventWorkflowDetailsComponent;
  let fixture: ComponentFixture<EventWorkflowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorkflowDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
