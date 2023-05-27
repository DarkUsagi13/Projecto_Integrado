import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;


  constructor() {
    this.socket = io('http://localhost:8000');
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public onPuestoStateChange(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('puesto_state_change', (data: any) => {
        observer.next(data);
      });
    });
  }
}
