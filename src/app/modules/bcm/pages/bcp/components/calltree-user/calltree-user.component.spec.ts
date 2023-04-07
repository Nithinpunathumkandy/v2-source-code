import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalltreeUserComponent } from './calltree-user.component';

describe('CalltreeUserComponent', () => {
  let component: CalltreeUserComponent;
  let fixture: ComponentFixture<CalltreeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalltreeUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalltreeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
