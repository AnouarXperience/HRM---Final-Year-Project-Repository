import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBillDetailsComponent } from './payment-bill-details.component';

describe('PaymentBillDetailsComponent', () => {
  let component: PaymentBillDetailsComponent;
  let fixture: ComponentFixture<PaymentBillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBillDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
