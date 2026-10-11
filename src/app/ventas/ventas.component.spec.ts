import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { VentasComponent } from './ventas.component';
import { VentasService } from '../servicios/ventas.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('VentasComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoVenta: vi.fn(() => of([])),
      insertarVenta: vi.fn(() => of({})),
      modificarVenta: vi.fn(() => of({})),
      eliminarVenta: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [VentasComponent],
      providers: [{ provide: VentasService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(VentasComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoVenta).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","cliente","id_tarima","descripcion_tarima","cantidad","precio_tarima"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "cliente": "ejemplo",
      "id_tarima": "ejemplo",
      "descripcion_tarima": "ejemplo",
      "cantidad": "2",
      "precio_tarima": "2"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarVenta).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarVenta).not.toHaveBeenCalled();
    expect(service.eliminarVenta).not.toHaveBeenCalled();
  });
});
