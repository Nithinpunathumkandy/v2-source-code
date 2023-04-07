import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaImplementationStatusesComponent } from './soa-implementation-statuses.component';

describe('SoaImplementationStatusesComponent', () => {
  let component: SoaImplementationStatusesComponent;
  let fixture: ComponentFixture<SoaImplementationStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoaImplementationStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoaImplementationStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
