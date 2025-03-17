import mongoose, { ClientSession, ObjectId } from "mongoose";
import CommentModel from "../models/CommentModel";
import CustomException from "../exceptions/CustomException";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import { IQuery } from "../interfaces/IQuery";
import { ICommentRepository } from "../interfaces/repositories/ICommentRepository";
import { IComment } from "../interfaces/IComment";

class CommentRepository implements ICommentRepository {
  async createComment(
    data: object,
    session?: mongoose.ClientSession
  ): Promise<IComment> {
    try {
      const comment = await CommentModel.create([data], { session });
      return comment[0];
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  }

  async getComment(
    id: string | ObjectId,
    ignoreDeleted: boolean
  ): Promise<IComment> {
    try {
      type searchQuery = {
        _id: mongoose.Types.ObjectId;
        isDeleted?: boolean;
      };
      const searchQuery: searchQuery = {
        _id: new mongoose.Types.ObjectId(id as string),
      };

      if (!ignoreDeleted) {
        searchQuery.isDeleted = false;
      }

      const comment = await CommentModel.aggregate([
        { $match: searchQuery },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
            pipeline: [{ $project: { _id: 1, name: 1, avatar: 1 } }],
          },
        },
      ]);

      if (!comment) {
        throw new CustomException(
          StatusCodeEnum.NotFound_404,
          "Comment not found"
        );
      }
      return comment[0];
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  }

  async getCommentsByPostId(
    postId: string | ObjectId,
    query: IQuery,
    ignoreDeleted: boolean
  ): Promise<{
    comments: IComment[];
    page: number;
    total: number;
    totalPages: number;
  }> {
    try {
      type searchQuery = {
        postId: mongoose.Types.ObjectId;
        isDeleted?: boolean;
      };
      const searchQuery: searchQuery = {
        postId: new mongoose.Types.ObjectId(postId as string),
      };
      if (!ignoreDeleted) {
        searchQuery.isDeleted = false;
      }
  
      const comments = await CommentModel.aggregate([
        {
          $match: searchQuery,
        },
        {
          $lookup: {
            from: "users", // The collection to join with (User collection)
            localField: "userId", // Field from the Comment collection
            foreignField: "_id", // Field from the User collection
            as: "user", // Output array field
          },
        },
        {
          $unwind: "$user", // Unwind the user array (since $lookup returns an array)
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            postId: 1,
            content: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            "user.name": 1,
          },
        },
        { $skip: (query.page - 1) * query.size },
        { $limit: query.size },
      ]);
  
      const totalComment = await CommentModel.countDocuments(searchQuery);
      return {
        comments: comments || [],
        page: query.page || 1,
        total: totalComment,
        totalPages: Math.ceil(totalComment / query.size),
      };
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  }

  async updateComment(
    id: string | ObjectId,
    data: object,
    session?: mongoose.ClientSession
  ): Promise<IComment> {
    try {
      const comment = await CommentModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id as string) },
        data,
        { session, new: true }
      );
      if (!comment) {
        throw new CustomException(
          StatusCodeEnum.NotFound_404,
          "Comment not found"
        );
      }
      return comment;
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  }
  async deleteComment(
    id: string | ObjectId,
    session?: ClientSession
  ): Promise<IComment | null> {
    try {
      const comment = await CommentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id as string),
          isDeleted: false,
        },
        { $set: { isDeleted: true } },
        { session, new: true }
      );

      if (!comment) {
        throw new CustomException(
          StatusCodeEnum.NotFound_404,
          "Comment not found"
        );
      }
      return comment;
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  }
}

export default CommentRepository;
