import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaImplementationStatusesModalComponent } from './soa-implementation-statuses-modal.component';

describe('SoaImplementationStatusesModalComponent', () => {
  let component: SoaImplementationStatusesModalComponent;
  let fixture: ComponentFixture<SoaImplementationStatusesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoaImplementationStatusesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoaImplementationStatusesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
