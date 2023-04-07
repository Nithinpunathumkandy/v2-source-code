import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraKriComponent } from './hira-kri.component';

describe('HiraKriComponent', () => {
  let component: HiraKriComponent;
  let fixture: ComponentFixture<HiraKriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraKriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraKriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
