import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationTypesComponent } from './business-application-types.component';

describe('BusinessApplicationTypesComponent', () => {
  let component: BusinessApplicationTypesComponent;
  let fixture: ComponentFixture<BusinessApplicationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessApplicationTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
