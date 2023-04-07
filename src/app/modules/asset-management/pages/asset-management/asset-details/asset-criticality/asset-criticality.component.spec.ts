import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCriticalityComponent } from './asset-criticality.component';

describe('AssetCriticalityComponent', () => {
  let component: AssetCriticalityComponent;
  let fixture: ComponentFixture<AssetCriticalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCriticalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCriticalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
