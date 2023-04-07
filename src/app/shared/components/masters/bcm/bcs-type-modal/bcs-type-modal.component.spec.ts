import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcsTypeModalComponent } from './bcs-type-modal.component';

describe('BcsTypeModalComponent', () => {
  let component: BcsTypeModalComponent;
  let fixture: ComponentFixture<BcsTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcsTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcsTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
