import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMappingLoaderComponent } from './asset-mapping-loader.component';

describe('AssetMappingLoaderComponent', () => {
  let component: AssetMappingLoaderComponent;
  let fixture: ComponentFixture<AssetMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
