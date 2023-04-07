import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPopupBoxComponent } from './user-popup-box.component';

describe('UserPopupBoxComponent', () => {
  let component: UserPopupBoxComponent;
  let fixture: ComponentFixture<UserPopupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPopupBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPopupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
