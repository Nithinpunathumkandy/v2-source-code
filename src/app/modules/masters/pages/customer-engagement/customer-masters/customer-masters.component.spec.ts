import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMastersComponent } from './customer-masters.component';

describe('CustomerMastersComponent', () => {
  let component: CustomerMastersComponent;
  let fixture: ComponentFixture<CustomerMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
