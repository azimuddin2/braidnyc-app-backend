import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  public finalFilter: FilterQuery<T> = {};

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;
    if (searchTerm) {
      this.finalFilter.$or = searchableFields.map(
        (field) =>
          ({
            [field]: { $regex: searchTerm, $options: 'i' },
          }) as FilterQuery<T>,
      );
    }
    return this;
  }

  filter() {
    const queryObj: Record<string, any> = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Handle price range
    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {} as { $gte?: number; $lte?: number };

      if (queryObj.minPrice) queryObj.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) queryObj.price.$lte = Number(queryObj.maxPrice);

      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    // Category filtering
    if (queryObj.category) {
      queryObj.category = {
        $regex: new RegExp(queryObj.category, 'i'),
      };
    }

    this.finalFilter = { ...this.finalFilter, ...queryObj };
    return this;
  }

  sort() {
    const sortStr =
      (this.query.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sortStr);
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalDoc = await this.modelQuery.model.countDocuments(
      this.finalFilter,
    );
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDoc / limit);

    return {
      page,
      limit,
      totalDoc,
      totalPage,
    };
  }
}

export default QueryBuilder;
