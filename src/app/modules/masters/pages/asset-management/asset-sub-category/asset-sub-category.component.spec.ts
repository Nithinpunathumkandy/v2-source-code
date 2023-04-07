import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSubCategoryComponent } from './asset-sub-category.component';

describe('AssetSubCategoryComponent', () => {
  let component: AssetSubCategoryComponent;
  let fixture: ComponentFixture<AssetSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
