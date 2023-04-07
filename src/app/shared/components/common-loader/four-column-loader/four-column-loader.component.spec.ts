import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourColumnLoaderComponent } from './four-column-loader.component';

describe('FourColumnLoaderComponent', () => {
  let component: FourColumnLoaderComponent;
  let fixture: ComponentFixture<FourColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
