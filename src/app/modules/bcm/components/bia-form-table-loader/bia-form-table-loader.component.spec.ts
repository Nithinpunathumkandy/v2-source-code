import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaFormTableLoaderComponent } from './bia-form-table-loader.component';

describe('BiaFormTableLoaderComponent', () => {
  let component: BiaFormTableLoaderComponent;
  let fixture: ComponentFixture<BiaFormTableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaFormTableLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaFormTableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
