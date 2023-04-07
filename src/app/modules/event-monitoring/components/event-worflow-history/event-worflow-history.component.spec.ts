import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWorflowHistoryComponent } from './event-worflow-history.component';

describe('EventWorflowHistoryComponent', () => {
  let component: EventWorflowHistoryComponent;
  let fixture: ComponentFixture<EventWorflowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWorflowHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWorflowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
