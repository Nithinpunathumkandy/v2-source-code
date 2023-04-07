import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSubCategoryModalComponent } from './risk-sub-category-modal.component';

describe('RiskSubCategoryModalComponent', () => {
  let component: RiskSubCategoryModalComponent;
  let fixture: ComponentFixture<RiskSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskSubCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
