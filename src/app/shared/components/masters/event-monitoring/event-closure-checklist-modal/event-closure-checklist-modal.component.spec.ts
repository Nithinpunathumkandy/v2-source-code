import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureChecklistModalComponent } from './event-closure-checklist-modal.component';

describe('EventClosureChecklistModalComponent', () => {
  let component: EventClosureChecklistModalComponent;
  let fixture: ComponentFixture<EventClosureChecklistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureChecklistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
