import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: any;

  constructor() {
    this.socket = io(environment.serverUrl);
  }

  // socket for posts //
  getPost(params, callback: (post: any) => void) {
    this.socket.emit('get-new-post', params, callback);
  }
  createPost(params, callback: (post: any) => void) {
    this.socket.emit('create-new-post', params, callback);
  }

  // socket for community //
  getCommunityPost(params, callback: (post: any) => void) {
    this.socket.emit('get-community-post', params, callback);
  }

  createCommunityPost(params, callback: (post: any) => void) {
    this.socket.emit('create-community-post', params, callback);
  }

  createCommunity(params, callback: (post: any) => void) {
    this.socket.emit('create-new-community', params, callback);
  }

  getCommunity(params, callback: (post: any) => void) {
    this.socket.emit('create-new-community', params, callback);
  }
}
