import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageTypesModalComponent } from './storage-types-modal.component';

describe('StorageTypesModalComponent', () => {
  let component: StorageTypesModalComponent;
  let fixture: ComponentFixture<StorageTypesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageTypesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
