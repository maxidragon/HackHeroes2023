import { HttpException, HttpStatus } from '@nestjs/common';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: any,
) => {
  const fileExtension = file.mimetype.split('/')[1];
  const validFiles = ['jpg', 'jpeg', 'png'];
  const maxSize = 1024 * 1024 * 5;

  if (file.size > maxSize)
    return callback(
      new HttpException(
        `${file.fieldname} is too big. Max size is ${maxSize / 1024 / 1024}MB`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      ),
      false,
    );

  if (validFiles.some((el) => fileExtension.includes(el)))
    return callback(null, true);

  return callback(
    new HttpException(
      `${file.fieldname} is not a valid document`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
    false,
  );
};
