import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMaturityMatrixRangesComponent } from './event-maturity-matrix-ranges.component';

describe('EventMaturityMatrixRangesComponent', () => {
  let component: EventMaturityMatrixRangesComponent;
  let fixture: ComponentFixture<EventMaturityMatrixRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMaturityMatrixRangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMaturityMatrixRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
