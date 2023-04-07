import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetItemPreviewComponent } from './asset-item-preview.component';

describe('AssetItemPreviewComponent', () => {
  let component: AssetItemPreviewComponent;
  let fixture: ComponentFixture<AssetItemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetItemPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
