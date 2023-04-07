import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcsFinancesComponent } from './bcs-finances.component';

describe('BcsFinancesComponent', () => {
  let component: BcsFinancesComponent;
  let fixture: ComponentFixture<BcsFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcsFinancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcsFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
