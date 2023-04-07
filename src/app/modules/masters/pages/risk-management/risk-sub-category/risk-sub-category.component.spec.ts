import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSubCategoryComponent } from './risk-sub-category.component';

describe('RiskSubCategoryComponent', () => {
  let component: RiskSubCategoryComponent;
  let fixture: ComponentFixture<RiskSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
