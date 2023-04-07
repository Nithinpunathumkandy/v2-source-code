import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStakeholderDetailsLoaderComponent } from './event-stakeholder-details-loader.component';

describe('EventStakeholderDetailsLoaderComponent', () => {
  let component: EventStakeholderDetailsLoaderComponent;
  let fixture: ComponentFixture<EventStakeholderDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventStakeholderDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStakeholderDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
