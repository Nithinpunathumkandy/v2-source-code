import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmTableLoaderComponent } from './bcm-table-loader.component';

describe('BcmTableLoaderComponent', () => {
  let component: BcmTableLoaderComponent;
  let fixture: ComponentFixture<BcmTableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmTableLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmTableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
