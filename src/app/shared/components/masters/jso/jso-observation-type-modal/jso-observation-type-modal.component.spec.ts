import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationTypeModalComponent } from './jso-observation-type-modal.component';

describe('JsoObservationTypeModalComponent', () => {
  let component: JsoObservationTypeModalComponent;
  let fixture: ComponentFixture<JsoObservationTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
