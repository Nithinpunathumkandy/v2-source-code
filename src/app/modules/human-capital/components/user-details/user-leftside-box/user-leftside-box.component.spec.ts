import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeftsideBoxComponent } from './user-leftside-box.component';

describe('UserLeftsideBoxComponent', () => {
  let component: UserLeftsideBoxComponent;
  let fixture: ComponentFixture<UserLeftsideBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLeftsideBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeftsideBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
