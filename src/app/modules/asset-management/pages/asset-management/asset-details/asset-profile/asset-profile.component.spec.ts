import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetProfileComponent } from './asset-profile.component';

describe('AssetProfileComponent', () => {
  let component: AssetProfileComponent;
  let fixture: ComponentFixture<AssetProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
