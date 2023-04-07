import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventBudgetComponent } from './add-event-budget.component';

describe('AddEventBudgetComponent', () => {
  let component: AddEventBudgetComponent;
  let fixture: ComponentFixture<AddEventBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
