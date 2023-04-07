import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCategoryComponent } from './risk-category.component';

describe('RiskCategoryComponent', () => {
  let component: RiskCategoryComponent;
  let fixture: ComponentFixture<RiskCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
