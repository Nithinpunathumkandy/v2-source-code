import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCategoryModalComponent } from './risk-category-modal.component';

describe('RiskCategoryModalComponent', () => {
  let component: RiskCategoryModalComponent;
  let fixture: ComponentFixture<RiskCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
