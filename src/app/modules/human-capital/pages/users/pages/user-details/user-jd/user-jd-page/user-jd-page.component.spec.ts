import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJdPageComponent } from './user-jd-page.component';

describe('UserJdPageComponent', () => {
  let component: UserJdPageComponent;
  let fixture: ComponentFixture<UserJdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserJdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
