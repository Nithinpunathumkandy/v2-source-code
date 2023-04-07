import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryModalComponent } from './service-category-modal.component';

describe('ServiceCategoryModalComponent', () => {
  let component: ServiceCategoryModalComponent;
  let fixture: ComponentFixture<ServiceCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
