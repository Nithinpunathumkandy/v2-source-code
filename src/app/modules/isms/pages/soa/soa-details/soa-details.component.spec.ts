import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoaDetailsComponent } from './soa-details.component';

describe('SoaDetailsComponent', () => {
  let component: SoaDetailsComponent;
  let fixture: ComponentFixture<SoaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
