import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmPreviewModalComponent } from './am-preview-modal.component';

describe('AmPreviewModalComponent', () => {
  let component: AmPreviewModalComponent;
  let fixture: ComponentFixture<AmPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
