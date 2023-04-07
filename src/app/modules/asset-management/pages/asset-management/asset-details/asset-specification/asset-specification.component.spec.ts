import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSpecificationComponent } from './asset-specification.component';

describe('AssetSpecificationComponent', () => {
  let component: AssetSpecificationComponent;
  let fixture: ComponentFixture<AssetSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSpecificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
