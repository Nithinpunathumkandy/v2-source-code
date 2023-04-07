import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetRatingsComponent } from './asset-ratings.component';

describe('AssetRatingsComponent', () => {
  let component: AssetRatingsComponent;
  let fixture: ComponentFixture<AssetRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetRatingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
