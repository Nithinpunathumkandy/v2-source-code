import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SixColumnLoaderComponent } from './six-column-loader.component';

describe('SixColumnLoaderComponent', () => {
  let component: SixColumnLoaderComponent;
  let fixture: ComponentFixture<SixColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SixColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SixColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
