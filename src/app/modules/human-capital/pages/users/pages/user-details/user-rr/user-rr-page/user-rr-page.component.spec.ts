import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRrPageComponent } from './user-rr-page.component';

describe('UserRrPageComponent', () => {
  let component: UserRrPageComponent;
  let fixture: ComponentFixture<UserRrPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRrPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRrPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
