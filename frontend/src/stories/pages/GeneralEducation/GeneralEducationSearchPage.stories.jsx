import React from "react";
import GeneralEducationSearchPage from "main/pages/GeneralEducation/Search/GeneralEducationSearchPage";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";
import primaryFixtures from "fixtures/primaryFixtures";

export default {
  title: "pages/GeneralEducation/GeneralEducationSearchPage",
  component: GeneralEducationSearchPage,
};

const Template = () => <GeneralEducationSearchPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403); // returns 403 when not logged in
    }),
    http.get("/api/public/primariesge", ({ request }) => {
      toast(`Generating ${request.method} ${request.url}`);
      return HttpResponse.json(primaryFixtures.f24_math_lowerDiv, {
        status: 200,
      });
    }),
  ],
};
