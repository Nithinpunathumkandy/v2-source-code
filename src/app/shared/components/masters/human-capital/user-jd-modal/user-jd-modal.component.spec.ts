import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJdModalComponent } from './user-jd-modal.component';

describe('UserJdModalComponent', () => {
  let component: UserJdModalComponent;
  let fixture: ComponentFixture<UserJdModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserJdModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
