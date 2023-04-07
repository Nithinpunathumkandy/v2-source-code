import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserPopupBoxComponent } from './modal-user-popup-box.component';

describe('ModalUserPopupBoxComponent', () => {
  let component: ModalUserPopupBoxComponent;
  let fixture: ComponentFixture<ModalUserPopupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUserPopupBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserPopupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
