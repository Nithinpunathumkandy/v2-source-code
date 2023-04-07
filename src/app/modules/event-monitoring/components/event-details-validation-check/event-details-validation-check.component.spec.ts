import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsValidationCheckComponent } from './event-details-validation-check.component';

describe('EventDetailsValidationCheckComponent', () => {
  let component: EventDetailsValidationCheckComponent;
  let fixture: ComponentFixture<EventDetailsValidationCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDetailsValidationCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsValidationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
