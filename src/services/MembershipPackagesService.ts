import { ObjectId } from "mongoose";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import CustomException from "../exceptions/CustomException";
import MembershipPackageRepository from "../repositories/MembershipPackageRepository";
import UserRepository from "../repositories/UserRepository";
import Database from "../utils/database";
import UserEnum from "../enums/UserEnum";
import { IQuery } from "../interfaces/IQuery";
import { IMembershipPackage } from "../interfaces/IMembershipPackage";

type PriceType = {
  value: number;
  unit: "USD" | "VND";
};
type DurationType = {
  value: number;
  unit: "DAY";
};
class MembershipPackageService {
  private membershipPackageRepository: MembershipPackageRepository;
  private userRepository: UserRepository;
  private database: Database;

  constructor() {
    this.membershipPackageRepository = new MembershipPackageRepository();
    this.userRepository = new UserRepository();
    this.database = Database.getInstance();
  }

  createMembershipPackage = async (
    name: string,
    description: string,
    price: PriceType,
    duration: DurationType,
    tier: number
  ) => {
    const session = await this.database.startTransaction();
    try {
      const checkmembership =
        await this.membershipPackageRepository.getMembershipByName(name);

      if (checkmembership) {
        throw new CustomException(
          StatusCodeEnum.BadRequest_400,
          "Membership package name already exists"
        );
      }

      const membershipPackage =
        await this.membershipPackageRepository.createMembershipPackage(
          {
            name,
            description,
            price,
            duration,
            tier,
          },
          session
        );

      await this.database.commitTransaction(session);
      return membershipPackage;
    } catch (error) {
      await this.database.abortTransaction(session);
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    } finally {
      await session.endSession();
    }
  };

  getMembershipPackage = async (
    id: string | ObjectId,
    requesterId: string
  ): Promise<IMembershipPackage> => {
    try {
      let ignoreDeleted = false;

      const checkRequester = await this.userRepository.getUserById(
        requesterId,
        ignoreDeleted
      );

      if (!checkRequester) {
        throw new CustomException(
          StatusCodeEnum.NotFound_404,
          "Requester not found"
        );
      }

      if (
        [UserEnum.ADMIN, UserEnum.SUPER_ADMIN].includes(checkRequester?.role)
      ) {
        ignoreDeleted = true;
      }

      const membershipPackage =
        await this.membershipPackageRepository.getMembershipPackage(
          id,
          ignoreDeleted
        );
      return membershipPackage;
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  };

  getMembershipPackages = async (query: IQuery, requesterId: string) => {
    try {
      let ignoreDeleted = false;

      const checkRequester = await this.userRepository.getUserById(
        requesterId,
        ignoreDeleted
      );

      if (!checkRequester) {
        throw new CustomException(
          StatusCodeEnum.NotFound_404,
          "Requester not found"
        );
      }

      if (
        [UserEnum.ADMIN, UserEnum.SUPER_ADMIN].includes(checkRequester?.role)
      ) {
        ignoreDeleted = true;
      }

      const memberships =
        await this.membershipPackageRepository.getMembershipPackages(
          query,
          ignoreDeleted
        );
      return memberships;
    } catch (error) {
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    }
  };

  updateMembershipPackage = async (
    id: string | ObjectId,
    name: string,
    description: string,
    price: PriceType,
    duration: DurationType,
    tier: number
  ) => {
    const session = await this.database.startTransaction();
    try {
      const oldPackage =
        await this.membershipPackageRepository.getMembershipPackage(id, false);

      const checkmembership =
        await this.membershipPackageRepository.getMembershipByName(name);

      if (checkmembership) {
        throw new CustomException(
          StatusCodeEnum.BadRequest_400,
          "Membership package name already exists"
        );
      }

      type data = {
        name?: string;
        description?: string;
        price?: PriceType;
        duration?: DurationType;
        tier?: number;
      };

      const data: data = {};

      if (name) {
        data.name = name;
      }

      if (description) {
        data.description = description;
      }

      if (price && !isNaN(price.value)) {
        if (!data.price) {
          data.price = {
            value: oldPackage.price.value,
            unit: oldPackage.price.unit,
          };
        }
        data.price.value = price.value;
        data.price.unit = price.unit || oldPackage.price.unit;
      }

      if (duration && !isNaN(duration.value)) {
        data.duration = duration;
      }
      if (tier && !isNaN(tier)) {
        data.tier = tier;
      }

      const membershipPackage =
        await this.membershipPackageRepository.updateMembershipPackage(
          id,
          data,
          session
        );
      await this.database.commitTransaction(session);
      return membershipPackage;
    } catch (error) {
      await this.database.abortTransaction(session);
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    } finally {
      await session.endSession();
    }
  };

  deleteMembershipPackage = async (id: string | ObjectId) => {
    const session = await this.database.startTransaction();
    try {
      const result =
        await this.membershipPackageRepository.deleteMembershipPackage(
          id,
          session
        );
      await this.database.commitTransaction(session);
      return result;
    } catch (error) {
      await this.database.abortTransaction(session);
      if (error as Error | CustomException) {
        throw error;
      }
      throw new CustomException(
        StatusCodeEnum.InternalServerError_500,
        "Internal Server Error"
      );
    } finally {
      await session.endSession();
    }
  };
}

export default MembershipPackageService;
