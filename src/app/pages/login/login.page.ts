import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario, UsuarioRegistro } from '../../interfaces/interfaces';
import { errorCodeUser } from '../../enums/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal', {static:true}) slides: IonSlides;
  selRegistro = false;

  

  

  loginUser = {
    email: 'samuelcg98@gmail.com',
    password: '123456'
  }

  registerUser: UsuarioRegistro = {
    email: '',
    password: '',
    nombre: {
      nombres: '',
      apellidos: ''
    },
    avatar: 'av-1.png'
  };

  constructor( private usuarioService:UsuarioService,
                private navCtrl:NavController,
                private uiService:UiServiceService ) { }

  ngOnInit() {
    this.slides.lockSwipes( true );
  }


  async login( fLogin:NgForm ) {
    if ( fLogin.invalid ) { return; }

    const valido = await this.usuarioService.login( this.loginUser.email, this.loginUser.password );

    if ( valido ) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated:true});
    } else {
      this.uiService.alertaInformativa('El usuario o la contraseña no son correctos');
    }
  }

  async registro( fRegistro:NgForm ) {

    if ( fRegistro.invalid ) { return; }

    const usuario = await this.usuarioService.registro( this.registerUser );

    if ( usuario['ok'] ) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated:true});
    } else {
      let mensaje = '';
      switch (usuario['errorCode']) {
        case errorCodeUser.InvEmail:
          mensaje = 'El email introducido no es válido';
          break;
        case errorCodeUser.InvName:
          mensaje = 'El nombre/apellidos no es válido';
          break;
        case errorCodeUser.InvPassLength:
          mensaje = 'La contraseña tiene que tener de 8 a 20 caracteres';
          break;
        case errorCodeUser.InvPassNumbers:
          mensaje = 'La contraseña tiene que contener un número';
          break;
        case errorCodeUser.InvPassLetters:
          mensaje = 'La contraseña tiene que contener letras';
          break;
        case errorCodeUser.InvPassUpper:
          mensaje = 'La contraseña tiene que contener una mayúscula';
          break;
        case errorCodeUser.InvPassLower:
          mensaje = 'La contraseña tiene que contener una minúscula';
          break;
        case errorCodeUser.InvPass:
          mensaje = 'La contraseña no puede contener caracteres especiales o espacios';
          break;
        case errorCodeUser.ExistEmail:
          mensaje = 'Este email ya está siendo utilizado por otro usuario';
          break;
        default:
          mensaje = 'No se ha podido crear este usuario. Inténtelo de nuevo'
          break;
      }
      this.uiService.alertaInformativa(mensaje);
    }
  }

  mostrarRegistro() {
    this.selRegistro = true;
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes( true );
  }

  mostrarLogin() {
    this.selRegistro = false;
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes( true );
  }

}
