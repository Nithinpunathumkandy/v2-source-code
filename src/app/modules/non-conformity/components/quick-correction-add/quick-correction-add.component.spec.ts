import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCorrectionAddComponent } from './quick-correction-add.component';

describe('QuickCorrectionAddComponent', () => {
  let component: QuickCorrectionAddComponent;
  let fixture: ComponentFixture<QuickCorrectionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickCorrectionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCorrectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
