import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFocusAreaInfoLoaderComponent } from './mapping-focus-area-info-loader.component';

describe('MappingFocusAreaInfoLoaderComponent', () => {
  let component: MappingFocusAreaInfoLoaderComponent;
  let fixture: ComponentFixture<MappingFocusAreaInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingFocusAreaInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingFocusAreaInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
