import { InternalServerErrorException } from "@nestjs/common";

export function errorCatcher(error: any, message: string, exeptionTag: string) {
  if (error?.options?.description === exeptionTag) {
    throw error;
  } else {
    console.log(message, error);
    throw new InternalServerErrorException();
  }
}
