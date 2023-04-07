import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMappingComponent } from './asset-mapping.component';

describe('AssetMappingComponent', () => {
  let component: AssetMappingComponent;
  let fixture: ComponentFixture<AssetMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
