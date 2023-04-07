import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextNoDataComponent } from './context-no-data.component';

describe('ContextNoDataComponent', () => {
  let component: ContextNoDataComponent;
  let fixture: ComponentFixture<ContextNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextNoDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
