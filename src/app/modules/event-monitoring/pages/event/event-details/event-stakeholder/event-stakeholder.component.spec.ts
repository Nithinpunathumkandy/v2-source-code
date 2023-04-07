import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStakeholderComponent } from './event-stakeholder.component';

describe('EventStakeholderComponent', () => {
  let component: EventStakeholderComponent;
  let fixture: ComponentFixture<EventStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventStakeholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
