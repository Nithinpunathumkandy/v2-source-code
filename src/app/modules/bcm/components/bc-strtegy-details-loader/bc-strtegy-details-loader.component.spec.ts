import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStrtegyDetailsLoaderComponent } from './bc-strtegy-details-loader.component';

describe('BcStrtegyDetailsLoaderComponent', () => {
  let component: BcStrtegyDetailsLoaderComponent;
  let fixture: ComponentFixture<BcStrtegyDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStrtegyDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStrtegyDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
