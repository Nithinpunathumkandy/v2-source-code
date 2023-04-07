import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorkflowPopupComponent } from './event-workflow-popup.component';

describe('EventWorkflowPopupComponent', () => {
  let component: EventWorkflowPopupComponent;
  let fixture: ComponentFixture<EventWorkflowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorkflowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorkflowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
