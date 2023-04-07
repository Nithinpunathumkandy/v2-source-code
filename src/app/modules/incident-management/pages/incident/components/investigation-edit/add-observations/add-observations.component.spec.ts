import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObservationsComponent } from './add-observations.component';

describe('AddObservationsComponent', () => {
  let component: AddObservationsComponent;
  let fixture: ComponentFixture<AddObservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddObservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
