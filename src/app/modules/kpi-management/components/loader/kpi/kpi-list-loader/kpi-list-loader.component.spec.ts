import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiListLoaderComponent } from './kpi-list-loader.component';

describe('KpiListLoaderComponent', () => {
  let component: KpiListLoaderComponent;
  let fixture: ComponentFixture<KpiListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
