import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCrScopeComponent } from './event-cr-scope.component';

describe('EventCrScopeComponent', () => {
  let component: EventCrScopeComponent;
  let fixture: ComponentFixture<EventCrScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCrScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCrScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
