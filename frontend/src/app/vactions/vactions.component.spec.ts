import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VactionsComponent } from './vactions.component';

describe('VactionsComponent', () => {
  let component: VactionsComponent;
  let fixture: ComponentFixture<VactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VactionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
