import { Document, Schema, model } from 'mongoose'

interface IUser extends Document {
  userId: string
  userName: string
  profile_pic: string
  gender: string
  reportCount: 0
  lastReportDate: Date
}

const UserSchema = new Schema({
  userId: String,
  userName: String,
  profile_pic: String,
  gender: String,
  reportCount: {
    type: Number,
    default: 0,
  },
  lastReportDate: {
    type: Date,
    default: new Date(),
  },
})

const UserModel = model<IUser>('User', UserSchema)

export default class User {
  static findById = async (userId: string): Promise<IUser> => {
    return await UserModel.findOne({ userId }).exec()
  }

  static findByName = async (userName: string): Promise<IUser> => {
    return await UserModel.findOne({ userName }).exec()
  }

  static findByGender = async (gender: string): Promise<IUser[]> => {
    return await UserModel.find({ gender }).exec()
  }

  static findAll = async (): Promise<IUser[]> => {
    return await UserModel.find().exec()
  }

  static saveUser = async ({
    userId,
    userName,
    profile_pic,
    gender,
  }: {
    userId: string
    userName: string
    profile_pic: string
    gender: string
  }) => {
    return await UserModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          userName,
          profile_pic,
          gender,
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
  }

  static addReportCount = async userId => {
    return await UserModel.findOneAndUpdate(
      { userId },
      {
        $inc: {
          reportCount: 1,
        },
        $set: {
          lastReportDate: new Date(),
        },
      },
      {
        new: true,
      }
    )
  }

  static resetReportCount = async userId => {
    return await UserModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          reportCount: 0,
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )
  }

  static removeAllUsers = async () => {
    return await UserModel.deleteMany({})
  }
}
