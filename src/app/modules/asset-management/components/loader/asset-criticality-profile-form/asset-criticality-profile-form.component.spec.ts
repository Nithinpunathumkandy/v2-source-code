import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCriticalityProfileFormComponent } from './asset-criticality-profile-form.component';

describe('AssetCriticalityProfileFormComponent', () => {
  let component: AssetCriticalityProfileFormComponent;
  let fixture: ComponentFixture<AssetCriticalityProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetCriticalityProfileFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetCriticalityProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
