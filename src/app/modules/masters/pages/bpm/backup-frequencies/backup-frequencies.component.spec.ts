import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupFrequenciesComponent } from './backup-frequencies.component';

describe('BackupFrequenciesComponent', () => {
  let component: BackupFrequenciesComponent;
  let fixture: ComponentFixture<BackupFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupFrequenciesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
