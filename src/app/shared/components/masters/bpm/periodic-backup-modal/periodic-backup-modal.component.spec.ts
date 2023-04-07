import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicBackupModalComponent } from './periodic-backup-modal.component';

describe('PeriodicBackupModalComponent', () => {
  let component: PeriodicBackupModalComponent;
  let fixture: ComponentFixture<PeriodicBackupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicBackupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicBackupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
