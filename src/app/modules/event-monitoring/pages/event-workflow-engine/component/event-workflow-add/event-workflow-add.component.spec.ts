import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorkflowAddComponent } from './event-workflow-add.component';

describe('EventWorkflowAddComponent', () => {
  let component: EventWorkflowAddComponent;
  let fixture: ComponentFixture<EventWorkflowAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorkflowAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorkflowAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
