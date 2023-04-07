import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBudgetComponent } from './event-budget.component';

describe('EventBudgetComponent', () => {
  let component: EventBudgetComponent;
  let fixture: ComponentFixture<EventBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
