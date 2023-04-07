import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCorrectionModalComponent } from './quick-correction-modal.component';

describe('QuickCorrectionModalComponent', () => {
  let component: QuickCorrectionModalComponent;
  let fixture: ComponentFixture<QuickCorrectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickCorrectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCorrectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
