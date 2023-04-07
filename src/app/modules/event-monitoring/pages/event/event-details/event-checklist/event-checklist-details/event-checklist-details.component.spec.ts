import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChecklistDetailsComponent } from './event-checklist-details.component';

describe('EventChecklistDetailsComponent', () => {
  let component: EventChecklistDetailsComponent;
  let fixture: ComponentFixture<EventChecklistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChecklistDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChecklistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
