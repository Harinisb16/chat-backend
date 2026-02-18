import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../config/db";

class ChatMessage extends Model<
  InferAttributes<ChatMessage>,
  InferCreationAttributes<ChatMessage>
> {
  declare id: CreationOptional<number>;

  declare senderId: number;
declare receiverId: number;

  declare message: string;

  declare delivered: CreationOptional<boolean>;
  declare mailSent: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    delivered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    mailSent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // ✅ ADD THESE TWO TO FIX ERROR
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
  }
);

export default ChatMessage;
