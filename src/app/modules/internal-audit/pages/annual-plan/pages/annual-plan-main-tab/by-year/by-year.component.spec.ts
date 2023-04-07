import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByYearComponent } from './by-year.component';

describe('ByYearComponent', () => {
  let component: ByYearComponent;
  let fixture: ComponentFixture<ByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
