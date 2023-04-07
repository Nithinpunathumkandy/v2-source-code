import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDeliverableModalComponent } from './event-deliverable-modal.component';

describe('EventDeliverableModalComponent', () => {
  let component: EventDeliverableModalComponent;
  let fixture: ComponentFixture<EventDeliverableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDeliverableModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDeliverableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
