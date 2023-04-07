import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTaskDetailsComponent } from './event-task-details.component';

describe('EventTaskDetailsComponent', () => {
  let component: EventTaskDetailsComponent;
  let fixture: ComponentFixture<EventTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTaskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
