import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionLoaderComponent } from './division-loader.component';

describe('DivisionLoaderComponent', () => {
  let component: DivisionLoaderComponent;
  let fixture: ComponentFixture<DivisionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
