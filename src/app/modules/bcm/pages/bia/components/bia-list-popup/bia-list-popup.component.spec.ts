import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaListPopupComponent } from './bia-list-popup.component';

describe('BiaListPopupComponent', () => {
  let component: BiaListPopupComponent;
  let fixture: ComponentFixture<BiaListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaListPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
