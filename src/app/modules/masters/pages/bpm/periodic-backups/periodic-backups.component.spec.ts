import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicBackupsComponent } from './periodic-backups.component';

describe('PeriodicBackupsComponent', () => {
  let component: PeriodicBackupsComponent;
  let fixture: ComponentFixture<PeriodicBackupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicBackupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicBackupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
