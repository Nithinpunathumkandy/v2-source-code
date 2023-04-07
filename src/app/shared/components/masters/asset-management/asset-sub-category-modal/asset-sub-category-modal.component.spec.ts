import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSubCategoryModalComponent } from './asset-sub-category-modal.component';

describe('AssetSubCategoryModalComponent', () => {
  let component: AssetSubCategoryModalComponent;
  let fixture: ComponentFixture<AssetSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSubCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
