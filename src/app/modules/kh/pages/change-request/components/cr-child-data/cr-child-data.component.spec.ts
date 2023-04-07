import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrChildDataComponent } from './cr-child-data.component';

describe('CrChildDataComponent', () => {
  let component: CrChildDataComponent;
  let fixture: ComponentFixture<CrChildDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrChildDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrChildDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
