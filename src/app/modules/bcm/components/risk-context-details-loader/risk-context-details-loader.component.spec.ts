import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskContextDetailsLoaderComponent } from './risk-context-details-loader.component';

describe('RiskContextDetailsLoaderComponent', () => {
  let component: RiskContextDetailsLoaderComponent;
  let fixture: ComponentFixture<RiskContextDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskContextDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskContextDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
