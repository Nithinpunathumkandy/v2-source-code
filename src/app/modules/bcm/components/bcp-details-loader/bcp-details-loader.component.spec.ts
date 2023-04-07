import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpDetailsLoaderComponent } from './bcp-details-loader.component';

describe('BcpDetailsLoaderComponent', () => {
  let component: BcpDetailsLoaderComponent;
  let fixture: ComponentFixture<BcpDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
