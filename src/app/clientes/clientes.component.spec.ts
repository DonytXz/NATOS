import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ClientesComponent } from './clientes.component';
import { ClientesService } from '../servicios/clientes.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('ClientesComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoCliente: vi.fn(() => of([])),
      insertarCliente: vi.fn(() => of({})),
      modificarCliente: vi.fn(() => of({})),
      eliminarCliente: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [ClientesComponent],
      providers: [{ provide: ClientesService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ClientesComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoCliente).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","empresa","nombre","apellido_paterno","apellido_materno","puesto","rfc","tipo_persona"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "empresa": "ejemplo",
      "nombre": "ejemplo",
      "apellido_paterno": "ejemplo",
      "apellido_materno": "ejemplo",
      "puesto": "ejemplo",
      "rfc": "ejemplo",
      "tipo_persona": "ejemplo"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarCliente).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarCliente).not.toHaveBeenCalled();
    expect(service.eliminarCliente).not.toHaveBeenCalled();
  });
});
