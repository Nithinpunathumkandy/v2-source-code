import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSignificantObservationsComponent } from './add-significant-observations.component';

describe('AddSignificantObservationsComponent', () => {
  let component: AddSignificantObservationsComponent;
  let fixture: ComponentFixture<AddSignificantObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSignificantObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSignificantObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
