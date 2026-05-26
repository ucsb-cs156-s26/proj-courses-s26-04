package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@WebMvcTest(controllers = TestErrorController.class)
public class TestErrorControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Test
  public void testError_throwsRuntimeException() throws Exception {
    assertThrows(Exception.class, () -> mockMvc.perform(get("/test-error")));
  }
}
