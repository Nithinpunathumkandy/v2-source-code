import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMeasureHistoryComponent } from './plan-measure-history.component';

describe('PlanMeasureHistoryComponent', () => {
  let component: PlanMeasureHistoryComponent;
  let fixture: ComponentFixture<PlanMeasureHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanMeasureHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanMeasureHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
