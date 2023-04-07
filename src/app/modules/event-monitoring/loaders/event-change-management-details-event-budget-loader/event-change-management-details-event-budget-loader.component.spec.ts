import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeManagementDetailsEventBudgetLoaderComponent } from './event-change-management-details-event-budget-loader.component';

describe('EventChangeManagementDetailsEventBudgetLoaderComponent', () => {
  let component: EventChangeManagementDetailsEventBudgetLoaderComponent;
  let fixture: ComponentFixture<EventChangeManagementDetailsEventBudgetLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeManagementDetailsEventBudgetLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeManagementDetailsEventBudgetLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
