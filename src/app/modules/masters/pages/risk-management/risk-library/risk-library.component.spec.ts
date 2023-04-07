import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLibraryComponent } from './risk-library.component';

describe('RiskLibraryComponent', () => {
  let component: RiskLibraryComponent;
  let fixture: ComponentFixture<RiskLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
