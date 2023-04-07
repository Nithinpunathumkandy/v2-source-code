import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplicationsComponent } from './business-applications.component';

describe('BusinessApplicationsComponent', () => {
  let component: BusinessApplicationsComponent;
  let fixture: ComponentFixture<BusinessApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
