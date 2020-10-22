import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Room, Usuario, Mensaje } from '../../interfaces/interfaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {

  @Input() room:Room = {};
  @Input() actualUser:Usuario = {};
  @Output() cargarChat = new EventEmitter();

  otherUser:Usuario = {};
  avatar:string = 'group.png';
  nombre:string = '';
  ultimoMensaje:string = '';
  usuarioNombre:string = 'Tú: ';
  
  constructor() {}
  
  ngOnInit() {
    // Si es un chat de solo dos personas
    if (this.room.singleUser) {
      this.otherUser = this.room.usuarios.filter(us => us.usuario._id !== this.actualUser._id )[0].usuario;
      
      this.avatar = this.otherUser.avatar || 'av-1.png';
      this.nombre = this.otherUser.nombreCompleto || '???';
    } else {
      this.nombre = this.room.nombre || '???';
    }

    this.formatearUltimoMensaje( this.room.ultimoMensaje );
  }


  abrirChat() {
    this.cargarChat.emit();
  }

  formatearUltimoMensaje (ultimoMensaje:Mensaje|null) {
    if (!ultimoMensaje) {
      this.ultimoMensaje = '';
      return;
    }
    
    let usuarioMensaje:Usuario = ultimoMensaje.usuario
    let mensaje:string = ultimoMensaje.mensaje

    if (usuarioMensaje._id !== this.actualUser._id) {
      this.usuarioNombre = ultimoMensaje.usuario.nombre.nombres + ': ';
    }
    
    this.ultimoMensaje = mensaje;
  }
}
