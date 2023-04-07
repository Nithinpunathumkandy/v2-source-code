import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsPageComponent } from './user-reports-page.component';

describe('UserReportsPageComponent', () => {
  let component: UserReportsPageComponent;
  let fixture: ComponentFixture<UserReportsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
