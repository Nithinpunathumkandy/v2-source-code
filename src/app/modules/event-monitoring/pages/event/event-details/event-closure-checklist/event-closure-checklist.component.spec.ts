import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureChecklistComponent } from './event-closure-checklist.component';

describe('EventClosureChecklistComponent', () => {
  let component: EventClosureChecklistComponent;
  let fixture: ComponentFixture<EventClosureChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
