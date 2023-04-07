import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationTypeComponent } from './jso-observation-type.component';

describe('JsoObservationTypeComponent', () => {
  let component: JsoObservationTypeComponent;
  let fixture: ComponentFixture<JsoObservationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
