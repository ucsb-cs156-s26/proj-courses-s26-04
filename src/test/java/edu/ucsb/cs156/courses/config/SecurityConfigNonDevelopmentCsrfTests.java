package edu.ucsb.cs156.courses.config;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.controllers.CourseOverTimeController;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@WebMvcTest(controllers = CourseOverTimeController.class)
@Import({SecurityConfig.class, RateLimitConfig.class})
public class SecurityConfigNonDevelopmentCsrfTests {

  @MockBean UserRepository userRepository;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Autowired private MockMvc mockMvc;

  @Test
  public void post_without_csrf_is_forbidden_outside_development() throws Exception {
    mockMvc.perform(post("/api/public/courseovertime/search")).andExpect(status().isForbidden());
  }

  @Test
  public void post_with_csrf_is_not_forbidden_outside_development() throws Exception {
    mockMvc
        .perform(post("/api/public/courseovertime/search").with(csrf()))
        .andExpect(status().isMethodNotAllowed());
  }
}
