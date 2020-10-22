import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { PostsService } from '../../services/posts.service';
import { errorCodeUser } from '../../enums/error';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario:Usuario = {};

  constructor( private usuarioService:UsuarioService,
                private uiService:UiServiceService,
                private postsService:PostsService ) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }


  async actualizar( fActualizar:NgForm ) {

    if ( fActualizar.invalid ) { return false; }

    const actualizado = await this.usuarioService.actualizarUsuario( this.usuario );
    if ( actualizado['ok'] ) {
      this.uiService.presentToast('Usuario Actualizado');
    } else {
      let mensaje = '';
      switch (actualizado['errorCode']) {
        case errorCodeUser.InvEmail:
          mensaje = 'El email introducido no es válido'
          break;
        
        case errorCodeUser.InvName:
          mensaje = 'El nombre/apellidos no es válido'
          break;

        default:
          mensaje = 'El usuario no se ha podido actualizar'
          break;
      }
      this.uiService.presentToast(mensaje);
    }

  }

  logout() {
    this.postsService.paginaPosts = 0;
    this.usuarioService.logout();
  }
}
