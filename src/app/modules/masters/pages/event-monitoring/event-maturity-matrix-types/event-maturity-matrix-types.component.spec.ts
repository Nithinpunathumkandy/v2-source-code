import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMaturityMatrixTypesComponent } from './event-maturity-matrix-types.component';

describe('EventMaturityMatrixTypesComponent', () => {
  let component: EventMaturityMatrixTypesComponent;
  let fixture: ComponentFixture<EventMaturityMatrixTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventMaturityMatrixTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMaturityMatrixTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
