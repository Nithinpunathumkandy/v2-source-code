import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmMastersComponent } from './bcm-masters.component';

describe('BcmMastersComponent', () => {
  let component: BcmMastersComponent;
  let fixture: ComponentFixture<BcmMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
