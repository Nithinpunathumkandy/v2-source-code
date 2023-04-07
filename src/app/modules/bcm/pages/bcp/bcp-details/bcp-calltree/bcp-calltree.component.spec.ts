import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpCalltreeComponent } from './bcp-calltree.component';

describe('BcpCalltreeComponent', () => {
  let component: BcpCalltreeComponent;
  let fixture: ComponentFixture<BcpCalltreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcpCalltreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcpCalltreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
