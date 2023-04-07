import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallNoDataComponent } from './small-no-data.component';

describe('SmallNoDataComponent', () => {
  let component: SmallNoDataComponent;
  let fixture: ComponentFixture<SmallNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallNoDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
