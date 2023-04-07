import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationDetailsComponent } from './jso-observation-details.component';

describe('JsoObservationDetailsComponent', () => {
  let component: JsoObservationDetailsComponent;
  let fixture: ComponentFixture<JsoObservationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
