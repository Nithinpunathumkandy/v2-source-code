import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationDetailsLoaderComponent } from './jso-observation-details-loader.component';

describe('JsoObservationDetailsLoaderComponent', () => {
  let component: JsoObservationDetailsLoaderComponent;
  let fixture: ComponentFixture<JsoObservationDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
