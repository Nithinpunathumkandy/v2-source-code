import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmityPreviewComponent } from './non-confirmity-preview.component';

describe('NonConfirmityPreviewComponent', () => {
  let component: NonConfirmityPreviewComponent;
  let fixture: ComponentFixture<NonConfirmityPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmityPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmityPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
