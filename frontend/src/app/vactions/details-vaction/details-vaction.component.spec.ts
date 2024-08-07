import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVactionComponent } from './details-vaction.component';

describe('DetailsVactionComponent', () => {
  let component: DetailsVactionComponent;
  let fixture: ComponentFixture<DetailsVactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsVactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsVactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
