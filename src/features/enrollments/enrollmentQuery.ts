import type { EnrollmentFilter, EnrollmentSort } from "../../types/enrollment";

export type FilterLogic = "AND" | "OR";

export interface EnrollmentQuery {
  advancedFilters: EnrollmentFilter[];
  filterLogic: FilterLogic;
  search: string;
  semester: string;
  sorts: EnrollmentSort[];
  status: string;
}

export function buildEnrollmentFilters(query: EnrollmentQuery) {
  return query.advancedFilters.map(({ field, operator, value }) => ({ field, operator, value }));
}

export function buildEnrollmentExportUrl(baseUrl: string, query: EnrollmentQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("quick_status", query.status);
  if (query.semester) params.set("quick_semester", query.semester);
  params.set("logic", query.filterLogic);

  query.sorts.forEach((sort, index) => {
    params.set(`sorts[${index}][field]`, sort.field);
    params.set(`sorts[${index}][dir]`, sort.dir);
  });

  buildEnrollmentFilters(query).forEach((filter, index) => {
    params.set(`filters[${index}][field]`, filter.field);
    params.set(`filters[${index}][operator]`, filter.operator);

    if (Array.isArray(filter.value)) {
      filter.value.forEach((value, valueIndex) => params.set(`filters[${index}][value][${valueIndex}]`, value));
    } else {
      params.set(`filters[${index}][value]`, filter.value);
    }
  });

  return `${baseUrl}/enrollments/export?${params.toString()}`;
}
