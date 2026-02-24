import React, { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Accordion, Form, Button } from "react-bootstrap";

export default function CSVDownloadsPage() {
  const [quarter, setQuarter] = useState("");
  const [subjectArea, setSubjectArea] = useState("");

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

              <Form>
                <Form.Group className="mb-3" controlId="quarterOnly">
                  <Form.Label>Quarter (yyyyq)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 20261"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    pattern="\d{5}"
                  />
                  <Form.Text muted>
                    Example: 20254 (F25), 20261 (W26), 20262 (S26)
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" disabled={!quarter}>
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

              <Form>
                <Form.Group className="mb-3" controlId="quarterWithSubject">
                  <Form.Label>Quarter (yyyyq)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 20261"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                    pattern="\d{5}"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="subjectArea">
                  <Form.Label>Subject Area</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. CMPSC"
                    value={subjectArea}
                    onChange={(e) => setSubjectArea(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  disabled={!quarter || !subjectArea}
                >
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