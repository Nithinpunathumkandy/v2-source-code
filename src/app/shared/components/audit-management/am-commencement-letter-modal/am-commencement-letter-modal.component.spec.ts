import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCommencementLetterModalComponent } from './am-commencement-letter-modal.component';

describe('AmCommencementLetterModalComponent', () => {
  let component: AmCommencementLetterModalComponent;
  let fixture: ComponentFixture<AmCommencementLetterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmCommencementLetterModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmCommencementLetterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
