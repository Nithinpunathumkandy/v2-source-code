import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenColumnLoaderComponent } from './ten-column-loader.component';

describe('TenColumnLoaderComponent', () => {
  let component: TenColumnLoaderComponent;
  let fixture: ComponentFixture<TenColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
