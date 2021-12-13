export class ResOp {
  readonly data: any;
  readonly code: number;
  readonly message: string;

  constructor(code: number, data?: any, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data?: any) {
    return new ResOp(200, data);
  }
}

export class Pagination {
  total: number;
  page: number;
  size: number;
}

export class PageResult<T> {
  list?: Array<T>;
  pagination: Pagination;
}
