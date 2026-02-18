
// export type Message = {
//   id: string;
//   senderId: number;
//   receiverId: number;
//   message: string;
//   delivered: boolean;
//   created_at: Date;
// };

// export type Message = {
//   id: number;
//   senderId: string;
//   receiverId: string;
//   message: string;
//   delivered: boolean;
//   createdAt: Date;   //  must match Sequelize
// };


export type Message = {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  delivered: boolean;
  createdAt: Date;
  updatedAt: Date;
};
