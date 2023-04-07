import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSourcesComponent } from './risk-sources.component';

describe('RiskSourcesComponent', () => {
  let component: RiskSourcesComponent;
  let fixture: ComponentFixture<RiskSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskSourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
