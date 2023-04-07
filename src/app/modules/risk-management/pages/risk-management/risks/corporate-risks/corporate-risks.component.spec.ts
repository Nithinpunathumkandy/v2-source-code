import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateRisksComponent } from './corporate-risks.component';

describe('CorporateRisksComponent', () => {
  let component: CorporateRisksComponent;
  let fixture: ComponentFixture<CorporateRisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateRisksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
