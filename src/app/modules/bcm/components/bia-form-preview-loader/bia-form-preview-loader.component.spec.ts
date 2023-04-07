import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaFormPreviewLoaderComponent } from './bia-form-preview-loader.component';

describe('BiaFormPreviewLoaderComponent', () => {
  let component: BiaFormPreviewLoaderComponent;
  let fixture: ComponentFixture<BiaFormPreviewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaFormPreviewLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaFormPreviewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
