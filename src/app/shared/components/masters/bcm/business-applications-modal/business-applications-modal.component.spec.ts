import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationsModalComponent } from './business-applications-modal.component';

describe('BusinessApplicationsModalComponent', () => {
  let component: BusinessApplicationsModalComponent;
  let fixture: ComponentFixture<BusinessApplicationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessApplicationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
