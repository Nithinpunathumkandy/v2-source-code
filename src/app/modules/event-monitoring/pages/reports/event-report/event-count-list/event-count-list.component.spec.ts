import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCountListComponent } from './event-count-list.component';

describe('EventCountListComponent', () => {
  let component: EventCountListComponent;
  let fixture: ComponentFixture<EventCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
