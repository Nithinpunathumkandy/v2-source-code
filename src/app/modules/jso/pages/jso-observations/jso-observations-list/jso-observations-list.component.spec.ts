import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoObservationsListComponent } from './jso-observations-list.component';

describe('JsoObservationsListComponent', () => {
  let component: JsoObservationsListComponent;
  let fixture: ComponentFixture<JsoObservationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoObservationsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoObservationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
