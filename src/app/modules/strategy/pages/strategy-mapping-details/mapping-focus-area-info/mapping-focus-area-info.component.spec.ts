import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFocusAreaInfoComponent } from './mapping-focus-area-info.component';

describe('MappingFocusAreaInfoComponent', () => {
  let component: MappingFocusAreaInfoComponent;
  let fixture: ComponentFixture<MappingFocusAreaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingFocusAreaInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingFocusAreaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
