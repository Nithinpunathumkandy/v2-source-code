import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmPreviewComponent } from './bcm-preview.component';

describe('BcmPreviewComponent', () => {
  let component: BcmPreviewComponent;
  let fixture: ComponentFixture<BcmPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
