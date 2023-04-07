import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTaskHistoryComponent } from './event-task-history.component';

describe('EventTaskHistoryComponent', () => {
  let component: EventTaskHistoryComponent;
  let fixture: ComponentFixture<EventTaskHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTaskHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTaskHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
