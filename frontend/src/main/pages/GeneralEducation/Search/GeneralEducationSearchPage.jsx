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

  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess });

  async function fetchGeneralEducationJSON(_event, query) {
    mutation.mutate(query);
  }
  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>UCSB General Education Search</h5>
        <GEAreaSearchForm fetchJSON={fetchGeneralEducationJSON} />
        <GEAreaTable generalEducation={generalEducationJSON} />
      </div>
    </BasicLayout>
  );
}
