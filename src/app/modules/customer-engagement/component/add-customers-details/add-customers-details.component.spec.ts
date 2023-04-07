import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomersDetailsComponent } from './add-customers-details.component';

describe('AddCustomersDetailsComponent', () => {
  let component: AddCustomersDetailsComponent;
  let fixture: ComponentFixture<AddCustomersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
