import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScopeComponent } from './event-scope.component';

describe('EventScopeComponent', () => {
  let component: EventScopeComponent;
  let fixture: ComponentFixture<EventScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
