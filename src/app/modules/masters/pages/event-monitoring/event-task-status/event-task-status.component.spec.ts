import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTaskStatusComponent } from './event-task-status.component';

describe('EventTaskStatusComponent', () => {
  let component: EventTaskStatusComponent;
  let fixture: ComponentFixture<EventTaskStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTaskStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTaskStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
