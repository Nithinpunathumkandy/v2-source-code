import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLibraryModalComponent } from './risk-library-modal.component';

describe('RiskLibraryModalComponent', () => {
  let component: RiskLibraryModalComponent;
  let fixture: ComponentFixture<RiskLibraryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskLibraryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLibraryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
