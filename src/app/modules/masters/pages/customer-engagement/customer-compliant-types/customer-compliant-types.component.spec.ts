import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCompliantTypesComponent } from './customer-compliant-types.component';

describe('CustomerCompliantTypesComponent', () => {
  let component: CustomerCompliantTypesComponent;
  let fixture: ComponentFixture<CustomerCompliantTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCompliantTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCompliantTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
