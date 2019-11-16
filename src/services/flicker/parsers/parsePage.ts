import Page from "../types/page";

export default function parsePage(json: any): Page {
  return {
    page: json.page,
    pages: json.pages,
    perPage: json.perpage,
    // make it number
    total: +json.total,
  };
}
