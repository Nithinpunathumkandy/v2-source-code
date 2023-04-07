import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoDashboardMainLoaderComponent } from './ceo-dashboard-main-loader.component';

describe('CeoDashboardMainLoaderComponent', () => {
  let component: CeoDashboardMainLoaderComponent;
  let fixture: ComponentFixture<CeoDashboardMainLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeoDashboardMainLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CeoDashboardMainLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
