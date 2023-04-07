import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyModalComponent } from './currency-modal.component';

describe('CurrencyModalComponent', () => {
  let component: CurrencyModalComponent;
  let fixture: ComponentFixture<CurrencyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
