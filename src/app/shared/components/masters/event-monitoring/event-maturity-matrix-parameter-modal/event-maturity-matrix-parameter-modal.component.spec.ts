import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMaturityMatrixParameterModalComponent } from './event-maturity-matrix-parameter-modal.component';

describe('EventMaturityMatrixParameterModalComponent', () => {
  let component: EventMaturityMatrixParameterModalComponent;
  let fixture: ComponentFixture<EventMaturityMatrixParameterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMaturityMatrixParameterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMaturityMatrixParameterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
