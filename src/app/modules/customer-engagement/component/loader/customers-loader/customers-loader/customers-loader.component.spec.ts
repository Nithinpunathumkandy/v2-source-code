import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersLoaderComponent } from './customers-loader.component';

describe('CustomersLoaderComponent', () => {
  let component: CustomersLoaderComponent;
  let fixture: ComponentFixture<CustomersLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
