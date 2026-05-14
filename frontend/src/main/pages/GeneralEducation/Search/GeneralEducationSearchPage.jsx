import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import GEAreaSearchForm from "main/components/GEAreas/GEAreaSearchForm";
import GEAreaTable from "main/components/GEAreas/GEAreaTable";
import { useBackendMutation } from "main/utils/useBackend";

export default function GeneralEducationSearchPage() {
  const [generalEducationJSON, setGeneralEducationJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    url: "/api/public/primariesge",
    params: {
      qtr: query.quarter,
      area: query.area,
    },
  });

  const onSuccess = (generalEducation) => {
    setGeneralEducationJSON(generalEducation);
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // TODO: Remove this line and implement a test for caching
    // Stryker disable next-line all : hard to set up test for caching
    [],
  );

  async function fetchGeneralEducationJSON(_event, query) {
    mutation.mutate(query);
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB General Education Search</h5>
        <GEAreaSearchForm fetchJSON={fetchGeneralEducationJSON} />
        <GEAreaTable generalEducation={generalEducationJSON} schedules={[]} />
      </div>
    </BasicLayout>
  );
}