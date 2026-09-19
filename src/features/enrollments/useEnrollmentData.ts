import { useEffect, useState } from "react";
import api from "../../api/axios";
import type { Enrollment, EnrollmentPagination } from "../../types/enrollment";
import { buildEnrollmentFilters, type EnrollmentQuery } from "./enrollmentQuery";

interface Options extends EnrollmentQuery {
  page: number;
  pageSize: number;
  refreshKey: number;
}

export default function useEnrollmentData({ advancedFilters, filterLogic, page, pageSize, refreshKey, search, semester, sorts, status }: Options) {
  const [data, setData] = useState<Enrollment[]>([]);
  const [pagination, setPagination] = useState<EnrollmentPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEnrollments() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EnrollmentPagination>("/enrollments", {
          signal: controller.signal,
          params: {
            page,
            page_size: pageSize,
            search: search || undefined,
            sorts: sorts.length ? sorts : undefined,
            logic: filterLogic,
            filters: buildEnrollmentFilters({ advancedFilters, filterLogic, search, semester, sorts, status }),
          },
        });
        setData(response.data.data);
        setPagination(response.data);
      } catch {
        if (!controller.signal.aborted) setError("Data KRS belum dapat dimuat. Periksa koneksi API lalu coba lagi.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadEnrollments();
    return () => controller.abort();
  }, [advancedFilters, filterLogic, page, pageSize, refreshKey, search, semester, sorts, status]);

  return { data, error, loading, pagination };
}
