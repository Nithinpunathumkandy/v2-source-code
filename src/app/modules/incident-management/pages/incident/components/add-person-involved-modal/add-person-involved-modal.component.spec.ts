import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonInvolvedModalComponent } from './add-person-involved-modal.component';

describe('AddPersonInvolvedModalComponent', () => {
  let component: AddPersonInvolvedModalComponent;
  let fixture: ComponentFixture<AddPersonInvolvedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPersonInvolvedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonInvolvedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
