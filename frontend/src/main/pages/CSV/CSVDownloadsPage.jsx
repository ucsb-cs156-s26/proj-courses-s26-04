import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion } from "react-bootstrap";

export default function CSVDownloadsPage() {
  return (
    <BasicLayout>
      <div className="container mt-3">
        <h1>CSV Downloads</h1>
        <Accordion>
          <Accordion.Item eventKey="by-quarter" key="by-quarter">
            <Accordion.Header>Download all UCSB classes by Quarter</Accordion.Header>
            <Accordion.Body>
              Download all classes for a given quarter (in <code>yyyyq</code>{" "}
              format). For now, use{" "}
              <a href="/swagger-ui/index.html#/API%20for%20course%20data%20as%20CSV%20downloads/csvForCourses">
                this endpoint
              </a>
              . Example quarters: <code>20254</code> (F25), <code>20261</code>{" "}
              (W26), <code>20262</code> (S26).
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item
            eventKey="by-quarter-and-subject-area"
            key="by-quarter-and-subject-area"
          >
            <Accordion.Header>
              Download by Quarter and Subject Area
            </Accordion.Header>
            <Accordion.Body>
              Download classes for a specific subject area and quarter (using{" "}
              <code>yyyyq</code>). For now, use{" "}
              <a href="/swagger-ui/index.html#/API%20for%20course%20data%20as%20CSV%20downloads/csvForCoursesQuarterAndSubjectArea">
                this endpoint
              </a>
              . Example: quarter <code>20261</code>, subject area{" "}
              <code>CMPSC</code>.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </BasicLayout>
  );
}
