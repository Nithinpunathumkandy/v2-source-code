import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationModalComponent } from './business-application-modal.component';

describe('BusinessApplicationModalComponent', () => {
  let component: BusinessApplicationModalComponent;
  let fixture: ComponentFixture<BusinessApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessApplicationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
