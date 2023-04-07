import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpInfoComponent } from './bcp-info.component';

describe('BcpInfoComponent', () => {
  let component: BcpInfoComponent;
  let fixture: ComponentFixture<BcpInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
