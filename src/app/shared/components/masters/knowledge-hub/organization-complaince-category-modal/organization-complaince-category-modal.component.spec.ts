import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationComplainceCategoryModalComponent } from './organization-complaince-category-modal.component';

describe('OrganizationComplainceCategoryModalComponent', () => {
  let component: OrganizationComplainceCategoryModalComponent;
  let fixture: ComponentFixture<OrganizationComplainceCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationComplainceCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationComplainceCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
