import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationsComponent } from './jso-observations.component';

describe('JsoObservationsComponent', () => {
  let component: JsoObservationsComponent;
  let fixture: ComponentFixture<JsoObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
