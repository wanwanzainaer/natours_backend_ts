import { Query, Document } from 'mongoose';

export class APIFeatures<Doc extends Document> {
  constructor(
    private query: Query<Doc[], Doc>,
    private queryString: { [key: string]: string }
  ) {}
  filter(): this {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields: string[] = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortByStr = this.queryString.sort as string;
      const sortBy = sortByStr.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fieldsStr = this.queryString.fields as string;
      const fields = fieldsStr.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate(): this {
    let page = this.queryString.page || 1;
    page = +page;
    let limit = this.queryString.limit || 100;
    limit = +limit;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
  FetchData(): Query<Doc[], Doc> {
    return this.query;
  }
}
