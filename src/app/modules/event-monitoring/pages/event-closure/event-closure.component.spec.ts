import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureComponent } from './event-closure.component';

describe('EventClosureComponent', () => {
  let component: EventClosureComponent;
  let fixture: ComponentFixture<EventClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
