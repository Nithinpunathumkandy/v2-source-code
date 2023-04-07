import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusAreaLoaderComponent } from './focus-area-loader.component';

describe('FocusAreaLoaderComponent', () => {
  let component: FocusAreaLoaderComponent;
  let fixture: ComponentFixture<FocusAreaLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocusAreaLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusAreaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
