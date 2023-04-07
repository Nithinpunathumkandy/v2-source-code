import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskKriLoaderComponent } from './risk-kri-loader.component';

describe('RiskKriLoaderComponent', () => {
  let component: RiskKriLoaderComponent;
  let fixture: ComponentFixture<RiskKriLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskKriLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskKriLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
