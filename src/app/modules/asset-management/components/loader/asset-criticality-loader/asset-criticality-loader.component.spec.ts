import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCriticalityLoaderComponent } from './asset-criticality-loader.component';

describe('AssetCriticalityLoaderComponent', () => {
  let component: AssetCriticalityLoaderComponent;
  let fixture: ComponentFixture<AssetCriticalityLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCriticalityLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCriticalityLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
