import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryModalComponent } from './asset-category-modal.component';

describe('AssetCategoryModalComponent', () => {
  let component: AssetCategoryModalComponent;
  let fixture: ComponentFixture<AssetCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
