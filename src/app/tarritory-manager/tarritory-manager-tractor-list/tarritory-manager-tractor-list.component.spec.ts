import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TarritoryManagerTractorListComponent } from './tarritory-manager-tractor-list.component';

describe('TarritoryManagerTractorListComponent', () => {
  let component: TarritoryManagerTractorListComponent;
  let fixture: ComponentFixture<TarritoryManagerTractorListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TarritoryManagerTractorListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TarritoryManagerTractorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
