import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnquiryListTarritoryManagerComponent } from './enquiry-list-tarritory-manager.component';

describe('EnquiryListTarritoryManagerComponent', () => {
  let component: EnquiryListTarritoryManagerComponent;
  let fixture: ComponentFixture<EnquiryListTarritoryManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryListTarritoryManagerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnquiryListTarritoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
