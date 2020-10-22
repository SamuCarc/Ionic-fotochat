import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Room, Usuario } from '../../interfaces/interfaces';
import { RoomService } from '../../services/room.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-room-messages',
  templateUrl: './room-messages.component.html',
  styleUrls: ['./room-messages.component.scss'],
})
export class RoomMessagesComponent implements OnInit {

  @Input() id:string;
  @Input() idUsuario:string;
  room:Room = {};

  nombre:string =  '';
  avatar:string = 'group.png';
  descripcion:string = '';
  otherUser:Usuario = {};

  constructor(  private modalCtr:ModalController,
                private roomService:RoomService,
                private uiService:UiServiceService ) { }

  ngOnInit() {
    this.obtenerRoom();
    console.log('ROOM INIT',this.room)
  }


  async obtenerRoom () {
    const roomDetails = await this.roomService.getRoomById(this.id);

    if (roomDetails['ok']) {
      this.room = await roomDetails['room'];
    } else {
      this.mostrarMensajeErr(roomDetails['errorCode']);
      this.modalCtr.dismiss();
    }

    // Comprobamos que tipo de sala es
    if (this.room.singleUser) { // Sala de dos usuarios
        this.otherUser = this.room.usuarios.filter(us => us.usuario._id !== this.idUsuario )[0].usuario;
    
        this.nombre = this.otherUser.nombreCompleto;
        this.descripcion = this.otherUser.email;
        this.avatar = this.otherUser.avatar;
      } else { // Grupo
        this.nombre = this.room.nombre;

        // Obtenemos los nombres de todos los usuarios de la sala
        // Para la descripcion
        const arrRoom = this.room.usuarios.sort((a, b) => {
          if ( a.usuario.nombre.nombres < b.usuario.nombre.nombres )
            return -1;
          if ( a.usuario.nombre.nombres > b.usuario.nombre.nombres )
            return 1;
          return 0;
        })

        arrRoom.forEach(el => {
          if (this.descripcion == '') 
            this.descripcion = el.usuario.nombre.nombres;
          else this.descripcion += ', ' + el.usuario.nombre.nombres
        });
      }
    }

  regresar() {
    this.modalCtr.dismiss();
  }

  mostrarMensajeErr (error:string) {
    let mensaje:string = '';
    switch (error) {
      case 'InvUser':
        mensaje = 'Error de autenticación';
        break;
      case 'NoRoom':
        mensaje = 'Esta sala no existe';
        break;
      default:
        break;
    }
    this.uiService.alertaInformativa(mensaje);
  }
}
