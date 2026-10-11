import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ standalone: true, imports: [RouterLink], template: `<section class="page"><div class="empty-state"><p class="eyebrow">Error 404</p><h1>No encontramos esta página.</h1><p>El enlace puede haber cambiado. Puedes volver al inicio o explorar nuestro catálogo.</p><div class="actions" style="justify-content:center;margin-top:24px"><a routerLink="/inicio" class="button">Volver al inicio</a><a routerLink="/catalogo" class="button-secondary">Ver catálogo</a></div></div></section>` })
export class NotFoundComponent {}
