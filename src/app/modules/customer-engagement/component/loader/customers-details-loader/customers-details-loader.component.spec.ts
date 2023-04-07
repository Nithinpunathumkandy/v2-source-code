import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersDetailsLoaderComponent } from './customers-details-loader.component';

describe('CustomersDetailsLoaderComponent', () => {
  let component: CustomersDetailsLoaderComponent;
  let fixture: ComponentFixture<CustomersDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
