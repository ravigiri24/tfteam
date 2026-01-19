import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarritoryManagerApprovalListComponent } from './tarritory-manager-approval-list.component';

describe('TarritoryManagerApprovalListComponent', () => {
  let component: TarritoryManagerApprovalListComponent;
  let fixture: ComponentFixture<TarritoryManagerApprovalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarritoryManagerApprovalListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarritoryManagerApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
