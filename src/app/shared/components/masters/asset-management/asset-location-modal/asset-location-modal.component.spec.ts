import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLocationModalComponent } from './asset-location-modal.component';

describe('AssetLocationModalComponent', () => {
  let component: AssetLocationModalComponent;
  let fixture: ComponentFixture<AssetLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetLocationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
