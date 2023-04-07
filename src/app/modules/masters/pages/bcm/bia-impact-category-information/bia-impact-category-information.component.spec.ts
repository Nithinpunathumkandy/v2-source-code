import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaImpactCategoryInformationComponent } from './bia-impact-category-information.component';

describe('BiaImpactCategoryInformationComponent', () => {
  let component: BiaImpactCategoryInformationComponent;
  let fixture: ComponentFixture<BiaImpactCategoryInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaImpactCategoryInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaImpactCategoryInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
