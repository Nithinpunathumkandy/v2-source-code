import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupFrequenciesModalComponent } from './backup-frequencies-modal.component';

describe('BackupFrequenciesModalComponent', () => {
  let component: BackupFrequenciesModalComponent;
  let fixture: ComponentFixture<BackupFrequenciesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupFrequenciesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupFrequenciesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
