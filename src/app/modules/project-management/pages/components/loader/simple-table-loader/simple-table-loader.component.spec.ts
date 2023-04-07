import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTableLoaderComponent } from './simple-table-loader.component';

describe('SimpleTableLoaderComponent', () => {
  let component: SimpleTableLoaderComponent;
  let fixture: ComponentFixture<SimpleTableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTableLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
