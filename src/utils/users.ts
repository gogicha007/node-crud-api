import * as uuid from 'uuid';
import { IFUser } from '../interfaces';

export class User {
  public id: string;
  public username: string;
  public age: number;
  public hobbies: string[];

  constructor(data: IFUser) {
    this.id = data.id ?? uuid.v1();
    this.username = data.username || '';
    this.age = data.age || 0;
    this.hobbies = data.hobbies || [];
  }
}
