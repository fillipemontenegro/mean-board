export class Message {
  constructor (
    public content: string,
    public userName: string,
    public messageId?: string,
    public userId?: string
  ){}
}
