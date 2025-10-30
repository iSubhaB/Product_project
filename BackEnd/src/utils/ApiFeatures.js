export default class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        if (this.queryStr.search) {
            const keyword = this.queryStr.search;
            this.query = this.query.find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            });
        }
        return this;
    }

    filter() {
        const queryObj = {};
        if (this.queryStr.categoryId) queryObj.category = this.queryStr.categoryId;
        if (this.queryStr.subCategoryId) queryObj.subCategory = this.queryStr.subCategoryId;
        this.query = this.query.find(queryObj);
        return this;
    }

    paginate(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
