import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionListComponent } from './unsafe-action-list.component';

describe('UnsafeActionListComponent', () => {
  let component: UnsafeActionListComponent;
  let fixture: ComponentFixture<UnsafeActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
