import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWitnessModalComponent } from './add-witness-modal.component';

describe('AddWitnessModalComponent', () => {
  let component: AddWitnessModalComponent;
  let fixture: ComponentFixture<AddWitnessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWitnessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWitnessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
