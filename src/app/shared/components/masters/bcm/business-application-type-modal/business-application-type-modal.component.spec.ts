import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationTypeModalComponent } from './business-application-type-modal.component';

describe('BusinessApplicationTypeModalComponent', () => {
  let component: BusinessApplicationTypeModalComponent;
  let fixture: ComponentFixture<BusinessApplicationTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessApplicationTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
