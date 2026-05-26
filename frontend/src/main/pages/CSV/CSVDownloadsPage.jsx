import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion, Form, Button } from "react-bootstrap";

import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";
import { useSystemInfo } from "main/utils/systemInfo";
import { useBackend } from "main/utils/useBackend";

import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "main/components/Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "main/components/Levels/SingleLevelDropdown";

export default function CSVDownloadsPage() {
  const { data: systemInfo } = useSystemInfo();

  const startQtr = systemInfo?.startQtrYYYYQ || "20211";
  const endQtr = systemInfo?.endQtrYYYYQ || "20214";

  const quarters = quarterRange(startQtr, endQtr);
  const defaultQuarter = quarters[quarters.length - 1].yyyyq;

  const {
    data: subjects,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/UCSBSubjects/all"],
    { method: "GET", url: "/api/UCSBSubjects/all" },
    [],
  );

  const defaultSubjectArea = "ANTH";

  const [quarterOnly, setQuarterOnly] = useState(defaultQuarter);
  const [quarterWithSubject, setQuarterWithSubject] = useState(defaultQuarter);
  const [subjectArea, setSubjectArea] = useState(
    subjects[0]?.subjectCode || defaultSubjectArea,
  );
  const [level, setLevel] = useState("U");
  const [omitSections, setOmitSections] = useState(true);
  const [withTimeLocations, setWithTimeLocations] = useState(true);

  const byQuarterUrl = `/api/courses/csv/quarter?yyyyq=${encodeURIComponent(
    quarterOnly,
  )}`;

  const byQuarterAndSubjectUrl =
    `/api/courses/csv/byQuarterAndSubjectArea?yyyyq=${encodeURIComponent(
      quarterWithSubject,
    )}` +
    `&subjectArea=${encodeURIComponent(subjectArea)}` +
    `&level=${encodeURIComponent(level)}` +
    `&omitSections=${omitSections}` +
    `&withTimeLocations=${withTimeLocations}`;

  const downloadCsv = (url) => {
    window.location.assign(url);
  };

  const handleQuarterSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterUrl);
  };

  const handleQuarterSubjectSubmit = (e) => {
    e.preventDefault();
    downloadCsv(byQuarterAndSubjectUrl);
  };

  return (
    <BasicLayout>
      <div className="container mt-3">
        <h1>CSV Downloads</h1>

        <Accordion defaultActiveKey="by-quarter" className="mt-3">
          {/* Download by Quarter */}
          <Accordion.Item eventKey="by-quarter">
            <Accordion.Header>
              Download all UCSB classes by Quarter
            </Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleQuarterSubmit}>
                <Form.Group className="mb-3" controlId="quarterOnly">
                  <SingleQuarterDropdown
                    quarters={quarters}
                    quarter={quarterOnly}
                    setQuarter={setQuarterOnly}
                    controlId={"CSVDownloads.QuarterOnly"}
                    label="Quarter (yyyyq)"
                  />
                </Form.Group>

                <Button type="submit" variant="primary">
                  Download CSV
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>

          {/* Download by Quarter + Subject Area */}
          <Accordion.Item eventKey="by-quarter-and-subject-area">
            <Accordion.Header>
              Download all UCSB classes by Quarter and Subject Area
            </Accordion.Header>
            <Accordion.Body>
              <Form onSubmit={handleQuarterSubjectSubmit}>
                <Form.Group className="mb-3" controlId="quarterWithSubject">
                  <SingleQuarterDropdown
                    quarters={quarters}
                    quarter={quarterWithSubject}
                    setQuarter={setQuarterWithSubject}
                    controlId={"CSVDownloads.QuarterWithSubject"}
                    label="Quarter (yyyyq)"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="subjectArea">
                  <SingleSubjectDropdown
                    subjects={subjects}
                    subject={subjectArea}
                    setSubject={setSubjectArea}
                    controlId={"CSVDownloads.SubjectArea"}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="level">
                  <SingleLevelDropdown
                    levels={allTheLevels}
                    level={level}
                    setLevel={setLevel}
                    controlId={"CSVDownloads.Level"}
                  />
                </Form.Group>

                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  id="omitSections"
                  label="Omit sections"
                  checked={omitSections}
                  onChange={(e) => setOmitSections(e.target.checked)}
                />

                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  id="withTimeLocations"
                  label="Only courses with times/locations assigned"
                  checked={withTimeLocations}
                  onChange={(e) => setWithTimeLocations(e.target.checked)}
                />

                <Button type="submit" variant="primary">
                  Download CSV
                </Button>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </BasicLayout>
  );
}
