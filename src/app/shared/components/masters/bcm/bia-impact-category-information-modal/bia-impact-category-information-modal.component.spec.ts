import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaImpactCategoryInformationModalComponent } from './bia-impact-category-information-modal.component';

describe('BiaImpactCategoryInformationModalComponent', () => {
  let component: BiaImpactCategoryInformationModalComponent;
  let fixture: ComponentFixture<BiaImpactCategoryInformationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaImpactCategoryInformationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaImpactCategoryInformationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
