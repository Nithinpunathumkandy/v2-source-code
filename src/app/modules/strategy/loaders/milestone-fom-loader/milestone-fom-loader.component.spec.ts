import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneFomLoaderComponent } from './milestone-fom-loader.component';

describe('MilestoneFomLoaderComponent', () => {
  let component: MilestoneFomLoaderComponent;
  let fixture: ComponentFixture<MilestoneFomLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestoneFomLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestoneFomLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
