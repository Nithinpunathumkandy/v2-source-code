import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmMastersComponent } from './cm-masters.component';

describe('CmMastersComponent', () => {
  let component: CmMastersComponent;
  let fixture: ComponentFixture<CmMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
