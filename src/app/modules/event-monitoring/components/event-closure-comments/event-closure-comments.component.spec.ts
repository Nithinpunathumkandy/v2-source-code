import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureCommentsComponent } from './event-closure-comments.component';

describe('EventClosureCommentsComponent', () => {
  let component: EventClosureCommentsComponent;
  let fixture: ComponentFixture<EventClosureCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
