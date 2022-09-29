import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class ResponseDto<T> {
  readonly data: T;

  @ApiProperty()
  readonly code: number;

  @ApiProperty()
  readonly message: string;

  constructor(code: number, data?: any, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data?: any) {
    return new ResponseDto(200, data);
  }
}

export class Pagination {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}

export class PaginatedResponseDto<T> {
  list: Array<T>;

  @ApiProperty()
  pagination: Pagination;
}

export const ApiResponse = <
  DataDto extends Type<unknown>,
  WrapperDataDto extends Type<unknown>,
>(
  dataDto: DataDto,
  wrapperDataDto: WrapperDataDto,
) =>
  applyDecorators(
    ApiExtraModels(wrapperDataDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(wrapperDataDto) },
          {
            properties: {
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponseData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => ApiResponse(dataDto, ResponseDto);

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) => ApiResponse(dataDto, PaginatedResponseDto);
