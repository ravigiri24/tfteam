import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferToNewArrivalsComponent } from './transfer-to-new-arrivals.component';

describe('TransferToNewArrivalsComponent', () => {
  let component: TransferToNewArrivalsComponent;
  let fixture: ComponentFixture<TransferToNewArrivalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferToNewArrivalsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferToNewArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
