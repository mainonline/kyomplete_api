/* eslint-disable no-param-reassign */
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sortBy?: string;
  populate?: string;
  search?: string;
  limit?: number;
  page?: number;
}

const paginate = <T extends Document, U extends Model<U>>(schema: Schema<T>): void => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    let sort: string = '';
    if (options.sortBy) {
      const sortingCriteria: any = [];
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    Object.entries(filter).forEach(([key, value]) => {
      // check value is number, if not apply regex
      if (typeof value === 'string' && !Number.isNaN(Number(value)) && key !== 'phone') {
        filter[key] = Number(value);
      } else if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
        filter[key] = new mongoose.Types.ObjectId(value);
      } else if (typeof value === 'string') {
        filter[key] = { $regex: value, $options: 'i' };
      }

      // return only tasks that are in that project or label
      if (
        key === 'projects' ||
        key === 'labels' ||
        key === 'tags' ||
        key === 'members' ||
        key === 'parentTasks' ||
        key === 'subTasks'
      ) {
        const projectIds: mongoose.Types.ObjectId[] = [];
        value.split(',').forEach((projectId: string) => {
          projectIds.push(new mongoose.Types.ObjectId(projectId));
        });

        filter[key] = { $in: projectIds };
      }
    });

    console.log('filter', filter);

    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const skip = (page - 1) * limit;

    let countPromise = this.countDocuments(filter);
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    // Sample search query
    if (options.search) {
      const isSearchValueNumber = !Number.isNaN(Number(options.search));
      const searchQuery = {
        $or: [
          { title: isSearchValueNumber ? options.search : { $regex: options.search, $options: 'i' } },
          { description: isSearchValueNumber ? options.search : { $regex: options.search, $options: 'i' } },
          { name: isSearchValueNumber ? options.search : { $regex: options.search, $options: 'i' } },
          { phone: isSearchValueNumber ? options.search : { $regex: options.search, $options: 'i' } },
          { email: isSearchValueNumber ? options.search : { $regex: options.search, $options: 'i' } },
        ],
      };

      docsPromise = docsPromise.where(searchQuery);
      countPromise = countPromise.where(searchQuery);
    }

    countPromise = countPromise.exec();

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: any) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a: string, b: string) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  });
};

export default paginate;
