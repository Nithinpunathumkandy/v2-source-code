import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaImagePreviewComponent } from './ca-image-preview.component';

describe('CaImagePreviewComponent', () => {
  let component: CaImagePreviewComponent;
  let fixture: ComponentFixture<CaImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaImagePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
