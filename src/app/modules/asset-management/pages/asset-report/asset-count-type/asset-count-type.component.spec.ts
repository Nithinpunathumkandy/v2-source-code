import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCountTypeComponent } from './asset-count-type.component';

describe('AssetCountTypeComponent', () => {
  let component: AssetCountTypeComponent;
  let fixture: ComponentFixture<AssetCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
