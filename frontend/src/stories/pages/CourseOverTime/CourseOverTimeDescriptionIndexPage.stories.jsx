import React from "react";

import CourseOverTimeDescriptionIndexPage from "main/pages/CourseOverTime/CourseOverTimeDescriptionIndexPage";
import { threeSections } from "fixtures/sectionFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/CourseOverTime/CourseOverTimeDescriptionIndexPage",
  component: CourseOverTimeDescriptionIndexPage,
};

const Template = () => <CourseOverTimeDescriptionIndexPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/UCSBSubjects/all", () => {
      return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
        status: 200,
      });
    }),
    http.get("/api/public/courseovertime/descriptionsearch", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(threeSections, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      });
    }),
    http.post("/logout", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    }),
  ],
};
