import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureDetailsComponent } from './event-closure-details.component';

describe('EventClosureDetailsComponent', () => {
  let component: EventClosureDetailsComponent;
  let fixture: ComponentFixture<EventClosureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
