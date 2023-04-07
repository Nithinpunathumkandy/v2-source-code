import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureListComponent } from './event-closure-list.component';

describe('EventClosureListComponent', () => {
  let component: EventClosureListComponent;
  let fixture: ComponentFixture<EventClosureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
