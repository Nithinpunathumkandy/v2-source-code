import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLeftTabLoaderComponent } from './table-left-tab-loader.component';

describe('TableLeftTabLoaderComponent', () => {
  let component: TableLeftTabLoaderComponent;
  let fixture: ComponentFixture<TableLeftTabLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableLeftTabLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLeftTabLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
