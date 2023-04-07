import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageTypesComponent } from './storage-types.component';

describe('StorageTypesComponent', () => {
  let component: StorageTypesComponent;
  let fixture: ComponentFixture<StorageTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
