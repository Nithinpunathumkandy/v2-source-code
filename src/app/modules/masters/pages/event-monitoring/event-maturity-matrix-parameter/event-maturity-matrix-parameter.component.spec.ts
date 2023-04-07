import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMaturityMatrixParameterComponent } from './event-maturity-matrix-parameter.component';

describe('EventMaturityMatrixParameterComponent', () => {
  let component: EventMaturityMatrixParameterComponent;
  let fixture: ComponentFixture<EventMaturityMatrixParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMaturityMatrixParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMaturityMatrixParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
