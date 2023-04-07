import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNoDataImageComponent } from './table-no-data-image.component';

describe('TableNoDataImageComponent', () => {
  let component: TableNoDataImageComponent;
  let fixture: ComponentFixture<TableNoDataImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableNoDataImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNoDataImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
