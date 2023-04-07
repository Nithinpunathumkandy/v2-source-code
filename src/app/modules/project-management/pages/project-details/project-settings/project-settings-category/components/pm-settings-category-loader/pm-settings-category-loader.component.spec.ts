import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmSettingsCategoryLoaderComponent } from './pm-settings-category-loader.component';

describe('PmSettingsCategoryLoaderComponent', () => {
  let component: PmSettingsCategoryLoaderComponent;
  let fixture: ComponentFixture<PmSettingsCategoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmSettingsCategoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmSettingsCategoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
