import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventClosureDetailsListPageComponent } from './event-closure-details-list-page.component';

describe('EventClosureDetailsListPageComponent', () => {
  let component: EventClosureDetailsListPageComponent;
  let fixture: ComponentFixture<EventClosureDetailsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventClosureDetailsListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventClosureDetailsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
