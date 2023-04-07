import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStakeholderDetailsComponent } from './event-stakeholder-details.component';

describe('EventStakeholderDetailsComponent', () => {
  let component: EventStakeholderDetailsComponent;
  let fixture: ComponentFixture<EventStakeholderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventStakeholderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStakeholderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
