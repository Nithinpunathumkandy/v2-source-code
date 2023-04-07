import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmCsaModalComponent } from './am-csa-modal.component';

describe('AmCsaModalComponent', () => {
  let component: AmCsaModalComponent;
  let fixture: ComponentFixture<AmCsaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmCsaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmCsaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
