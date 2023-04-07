import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMilestoneComponent } from './event-milestone.component';

describe('EventMilestoneComponent', () => {
  let component: EventMilestoneComponent;
  let fixture: ComponentFixture<EventMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
