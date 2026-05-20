import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UsersTable from "main/components/Users/UsersTable";
import { useState } from "react";
import OurPagination from "main/components/Utils/OurPagination";

import { useBackend } from "main/utils/useBackend";
const AdminUsersPage = () => {
  const [selectedPage, setSelectedPage] = useState(1);

  const {
    data: page,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/admin/users", selectedPage],
    {
      // Stryker disable next-line StringLiteral : GET is default, so replacing with "" is an equivalent mutation
      method: "GET",
      url: "/api/admin/users",
      params: {
        page: selectedPage - 1,
        pageSize: 10,
        sortDirection: "ASC",
      },
    },
    { content: [], totalPages: 0 },
  );

  return (
    <BasicLayout>
      <h2>Users</h2>
      <UsersTable users={page.content} />
      <div className="d-flex justify-content-center">
        <OurPagination
          updateActivePage={setSelectedPage}
          totalPages={page.totalPages}
        />
      </div>
    </BasicLayout>
  );
};

export default AdminUsersPage;
