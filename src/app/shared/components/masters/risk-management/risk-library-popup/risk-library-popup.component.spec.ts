import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLibraryPopupComponent } from './risk-library-popup.component';

describe('RiskLibraryPopupComponent', () => {
  let component: RiskLibraryPopupComponent;
  let fixture: ComponentFixture<RiskLibraryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskLibraryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLibraryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
