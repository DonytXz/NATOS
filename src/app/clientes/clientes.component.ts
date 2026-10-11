import { Component, inject } from '@angular/core';
import { ClientesService } from '../servicios/clientes.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  private readonly service = inject(ClientesService);
  readonly workspace: RecordWorkspace = {
    title: 'Clientes',
    singular: 'Cliente',
    group: 'Directorio',
    description: 'La información de tus clientes, siempre a la mano.',
    nameKey: 'empresa',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "empresa",
        "label": "Empresa",
        "required": true
      },
      {
        "key": "nombre",
        "label": "Nombre",
        "required": true
      },
      {
        "key": "apellido_paterno",
        "label": "Apellido paterno"
      },
      {
        "key": "apellido_materno",
        "label": "Apellido materno"
      },
      {
        "key": "puesto",
        "label": "Puesto"
      },
      {
        "key": "rfc",
        "label": "RFC"
      },
      {
        "key": "tipo_persona",
        "label": "Tipo de persona",
        "hint": "Usa el valor registrado: por ejemplo, física o moral."
      }
    ],
    list: () => this.service.consultartodoCliente(),
    create: record => this.service.insertarCliente(record),
    update: record => this.service.modificarCliente(record),
    remove: record => this.service.eliminarCliente(record),
  };
}
