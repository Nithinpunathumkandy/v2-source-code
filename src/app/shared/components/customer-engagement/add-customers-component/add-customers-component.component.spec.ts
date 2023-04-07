import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomersComponentComponent } from './add-customers-component.component';

describe('AddCustomersComponentComponent', () => {
  let component: AddCustomersComponentComponent;
  let fixture: ComponentFixture<AddCustomersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomersComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
