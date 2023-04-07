import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsAssetCriticalityComponent } from './isms-asset-criticality.component';

describe('IsmsAssetCriticalityComponent', () => {
  let component: IsmsAssetCriticalityComponent;
  let fixture: ComponentFixture<IsmsAssetCriticalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsAssetCriticalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsAssetCriticalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
