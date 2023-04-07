import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaAddModalComponent } from './rca-add-modal.component';

describe('RcaAddModalComponent', () => {
  let component: RcaAddModalComponent;
  let fixture: ComponentFixture<RcaAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcaAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcaAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
