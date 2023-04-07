import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpVersionsComponent } from './bcp-versions.component';

describe('BcpVersionsComponent', () => {
  let component: BcpVersionsComponent;
  let fixture: ComponentFixture<BcpVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpVersionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
