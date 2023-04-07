import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetailsLoaderComponent } from './kpi-details-loader.component';

describe('KpiDetailsLoaderComponent', () => {
  let component: KpiDetailsLoaderComponent;
  let fixture: ComponentFixture<KpiDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
