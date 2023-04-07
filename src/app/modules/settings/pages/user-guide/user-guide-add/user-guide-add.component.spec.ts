import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuideAddComponent } from './user-guide-add.component';

describe('UserGuideAddComponent', () => {
  let component: UserGuideAddComponent;
  let fixture: ComponentFixture<UserGuideAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGuideAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
