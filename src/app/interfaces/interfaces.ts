// Generated by https://quicktype.io

export interface RespuestaPosts {
    ok:     boolean;
    pagina: number;
    posts:  Post[];
}

export interface Post {
    imgs?:    string[];
    _id?:     string;
    mensaje?: string;
    coords?:  string;
    usuario?: Usuario;
    created?: string;
}

export interface Nombre {
    nombres?:string;
    apellidos?:string;
}


export interface UsuarioFormateado {
    avatar?: string;
    _id?:    string;
    nombres?:string;
    apellidos?:string;
    email?:  string;
    password?: string;
}
// Generated by https://quicktype.io

export interface ResponseSubida {
    ok:    boolean;
    file: string;
}


// Generated by https://quicktype.io

export interface RespuestaRooms {
    ok:     boolean;
    pagina: number;
    rooms:  Room[];
}

export interface Room {
    nombre?:        string;
    ultimoMensaje?: Mensaje;
    singleUser?:    boolean;
    _id?:           string;
    usuarios?:      UsuarioRoom[];
    creator?:       Usuario;
    created?:       string;
}

export interface Usuario {
    _id?:                string;
    nombre?:             Nombre;
    avatar?:             string;
    nombreCompleto?:     string;
    nombreCompletoSala?: string;
    email?:              string;
    isEmailValidated?:   boolean;
    created?:            string;
    id?:                 string;
}

export interface UsuarioRoom {
    isAdmin?:    boolean;
    isSilenced?: boolean;
    blocked?:    boolean;
    _id?:        string;
    usuario?:    Usuario;
    added?:      string;
}

export interface UsuarioRegistro {
    _id?:                string;
    nombre?:             Nombre;
    avatar?:             string;
    nombreCompleto?:     string;
    nombreCompletoSala?: string;
    email?:              string;
    isEmailValidated?:   boolean;
    created?:            string;
    id?:                 string;
    password?:           string;
}


// Generated by https://quicktype.io

export interface Mensaje {
    deleted:    Deleted;
    edited:     Edited;
    imgs:       any[];
    referencia: any;
    _id:        string;
    usuario:    Usuario;
    room:       Room;
    mensaje:    string;
    created:    string;
}

export interface Deleted {
    date:      any;
    isDeleted: boolean;
}

export interface Edited {
    date:     any;
    isEdited: boolean;
}


// Generated by https://quicktype.io

export interface RespuestaMensaje {
    ok:           boolean;
    pagina:       number;
    mensajesRoom: Mensaje[];
    errorCode?:string;
    mensaje?:string;
}

// Generated by https://quicktype.io

export interface RespuestaRoom {
    ok:   boolean;
    room: Room;
    errorCode?:string;
    mensaje?:string;
}

