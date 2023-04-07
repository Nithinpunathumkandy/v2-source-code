import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsaDetailsComponent } from './csa-details.component';

describe('CsaDetailsComponent', () => {
  let component: CsaDetailsComponent;
  let fixture: ComponentFixture<CsaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
