import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraRegisterComponent } from './hira-register.component';

describe('HiraRegisterComponent', () => {
  let component: HiraRegisterComponent;
  let fixture: ComponentFixture<HiraRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
