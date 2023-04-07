import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorkflowListComponent } from './event-workflow-list.component';

describe('EventWorkflowListComponent', () => {
  let component: EventWorkflowListComponent;
  let fixture: ComponentFixture<EventWorkflowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorkflowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorkflowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
