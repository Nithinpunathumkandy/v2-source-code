import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageLocationsModalComponent } from './storage-locations-modal.component';

describe('StorageLocationsModalComponent', () => {
  let component: StorageLocationsModalComponent;
  let fixture: ComponentFixture<StorageLocationsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageLocationsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageLocationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
