import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetOptionValuesComponent } from './asset-option-values.component';

describe('AssetOptionValuesComponent', () => {
  let component: AssetOptionValuesComponent;
  let fixture: ComponentFixture<AssetOptionValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetOptionValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetOptionValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
