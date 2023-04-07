import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaTireComponent } from './bia-tire.component';

describe('BiaTireComponent', () => {
  let component: BiaTireComponent;
  let fixture: ComponentFixture<BiaTireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaTireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaTireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
