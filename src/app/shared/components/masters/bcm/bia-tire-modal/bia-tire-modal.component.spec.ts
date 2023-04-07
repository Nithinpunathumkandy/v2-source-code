import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaTireModalComponent } from './bia-tire-modal.component';

describe('BiaTireModalComponent', () => {
  let component: BiaTireModalComponent;
  let fixture: ComponentFixture<BiaTireModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaTireModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaTireModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
