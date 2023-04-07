import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmSettingsCategoryModalComponent } from './pm-settings-category-modal.component';

describe('PmSettingsCategoryModalComponent', () => {
  let component: PmSettingsCategoryModalComponent;
  let fixture: ComponentFixture<PmSettingsCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmSettingsCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmSettingsCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
