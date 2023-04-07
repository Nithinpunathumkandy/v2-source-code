import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmAssetModalComponent } from './bpm-asset-modal.component';

describe('BpmAssetModalComponent', () => {
  let component: BpmAssetModalComponent;
  let fixture: ComponentFixture<BpmAssetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmAssetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmAssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
