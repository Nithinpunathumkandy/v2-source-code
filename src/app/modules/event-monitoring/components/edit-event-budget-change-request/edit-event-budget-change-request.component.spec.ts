import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventBudgetChangeRequestComponent } from './edit-event-budget-change-request.component';

describe('EditEventBudgetChangeRequestComponent', () => {
  let component: EditEventBudgetChangeRequestComponent;
  let fixture: ComponentFixture<EditEventBudgetChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventBudgetChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventBudgetChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
