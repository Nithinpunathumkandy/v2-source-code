import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArciComponent } from './arci.component';

describe('ArciComponent', () => {
  let component: ArciComponent;
  let fixture: ComponentFixture<ArciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
