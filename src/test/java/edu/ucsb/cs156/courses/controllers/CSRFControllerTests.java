package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.config.RateLimitConfig;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@ActiveProfiles("development")
@WebMvcTest(controllers = CSRFController.class)
@Import({SecurityConfig.class, RateLimitConfig.class})
public class CSRFControllerTests {

  @MockBean UserRepository userRepository;

  @Autowired private MockMvc mockMvc;

  @Test
  public void csrf_returns_ok() throws Exception {
    MvcResult response = mockMvc.perform(get("/csrf")).andExpect(status().isOk()).andReturn();

    String responseString = response.getResponse().getContentAsString();
    assertTrue(responseString.contains("parameterName"));
    assertTrue(responseString.contains("_csrf"));
    assertTrue(responseString.contains("headerName"));
    assertTrue(responseString.contains("X-XSRF-TOKEN"));
  }
}
