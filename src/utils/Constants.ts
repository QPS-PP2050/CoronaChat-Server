export enum ChatEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  MEMBERLIST = 'member_list',
  CHANNEL_CHANGE = 'change-channel',
  SERVER = 'servers',
  CHANNEL = 'channels'
}

export enum ChannelType {
    TEXT = 'text',
    VOICE = 'voice'
}