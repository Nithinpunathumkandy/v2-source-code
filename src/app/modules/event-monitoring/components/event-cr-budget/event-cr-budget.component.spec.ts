import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCrBudgetComponent } from './event-cr-budget.component';

describe('EventCrBudgetComponent', () => {
  let component: EventCrBudgetComponent;
  let fixture: ComponentFixture<EventCrBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventCrBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCrBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
