import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransactionCustComponent } from './view-transaction-cust.component';

describe('ViewTransactionCustComponent', () => {
  let component: ViewTransactionCustComponent;
  let fixture: ComponentFixture<ViewTransactionCustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTransactionCustComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTransactionCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
