import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationsModelComponent } from './jso-observations-model.component';

describe('JsoObservationsModelComponent', () => {
  let component: JsoObservationsModelComponent;
  let fixture: ComponentFixture<JsoObservationsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationsModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
