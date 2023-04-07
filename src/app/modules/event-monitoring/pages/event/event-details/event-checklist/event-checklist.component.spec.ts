import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChecklistComponent } from './event-checklist.component';

describe('EventChecklistComponent', () => {
  let component: EventChecklistComponent;
  let fixture: ComponentFixture<EventChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
