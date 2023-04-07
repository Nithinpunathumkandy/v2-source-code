import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsaChildComponent } from './csa-child.component';

describe('CsaChildComponent', () => {
  let component: CsaChildComponent;
  let fixture: ComponentFixture<CsaChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsaChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsaChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
