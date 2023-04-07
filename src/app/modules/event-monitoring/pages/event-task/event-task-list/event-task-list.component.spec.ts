import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTaskListComponent } from './event-task-list.component';

describe('EventTaskListComponent', () => {
  let component: EventTaskListComponent;
  let fixture: ComponentFixture<EventTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
