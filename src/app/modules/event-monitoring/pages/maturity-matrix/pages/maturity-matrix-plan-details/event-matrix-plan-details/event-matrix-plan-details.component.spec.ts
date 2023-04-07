import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMatrixPlanDetailsComponent } from './event-matrix-plan-details.component';

describe('EventMatrixPlanDetailsComponent', () => {
  let component: EventMatrixPlanDetailsComponent;
  let fixture: ComponentFixture<EventMatrixPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMatrixPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMatrixPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
