import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaAddComponent } from './bia-add.component';

describe('BiaAddComponent', () => {
  let component: BiaAddComponent;
  let fixture: ComponentFixture<BiaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
