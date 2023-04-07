import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetProfileLoaderComponent } from './asset-profile-loader.component';

describe('AssetProfileLoaderComponent', () => {
  let component: AssetProfileLoaderComponent;
  let fixture: ComponentFixture<AssetProfileLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetProfileLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetProfileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
