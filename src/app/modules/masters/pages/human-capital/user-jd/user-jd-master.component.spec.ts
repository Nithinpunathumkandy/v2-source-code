import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJdMasterComponent } from './user-jd-master.component';

describe('UserJdMasterComponent', () => {
  let component: UserJdMasterComponent;
  let fixture: ComponentFixture<UserJdMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserJdMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJdMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
