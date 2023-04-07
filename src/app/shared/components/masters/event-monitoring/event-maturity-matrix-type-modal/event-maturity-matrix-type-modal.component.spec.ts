import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMaturityMatrixTypeModalComponent } from './event-maturity-matrix-type-modal.component';

describe('EventMaturityMatrixTypeModalComponent', () => {
  let component: EventMaturityMatrixTypeModalComponent;
  let fixture: ComponentFixture<EventMaturityMatrixTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMaturityMatrixTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMaturityMatrixTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
