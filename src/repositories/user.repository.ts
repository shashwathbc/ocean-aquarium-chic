import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/db';

export class UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        await dbConnect();
        // We need to explicitly select the password field for authentication
        return User.findOne({ email }).select('+password').exec();
    }

    async findById(id: string): Promise<IUser | null> {
        await dbConnect();
        return User.findById(id).exec();
    }

    async create(userData: Partial<IUser>): Promise<IUser> {
        await dbConnect();
        const user = new User(userData);
        return user.save();
    }

    async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        await dbConnect();
        return User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
    }
}

export const userRepository = new UserRepository();
