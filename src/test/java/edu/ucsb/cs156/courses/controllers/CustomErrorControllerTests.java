package edu.ucsb.cs156.courses.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import jakarta.servlet.RequestDispatcher;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;

@WebMvcTest(controllers = CustomErrorController.class)
public class CustomErrorControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Test
  public void testHandleError_404() throws Exception {
    mockMvc.perform(get("/error")
            .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 404)
            .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/some-non-existent-page"))
        .andExpect(status().isOk())
        .andExpect(view().name("error"))
        .andExpect(model().attribute("status", 404))
        .andExpect(model().attribute("error", HttpStatus.NOT_FOUND.getReasonPhrase()))
        .andExpect(model().attribute("message",
            "The page you are looking for is either have been removed or temporarily unavailable."));
  }

  @Test
  public void testHandleError_403() throws Exception {
    mockMvc.perform(get("/error")
            .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 403)
            .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/admin/something"))
        .andExpect(status().isOk())
        .andExpect(view().name("error"))
        .andExpect(model().attribute("status", 403))
        .andExpect(model().attribute("error", HttpStatus.FORBIDDEN.getReasonPhrase()))
        .andExpect(model().attribute("message", "Access Denied"));
  }

  @Test
  public void testHandleError_500_withException() throws Exception {
    Exception testException = new RuntimeException("Test exception");
    mockMvc.perform(get("/error")
            .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
            .requestAttr(RequestDispatcher.ERROR_EXCEPTION, testException)
            .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/api/something"))
        .andExpect(status().isOk())
        .andExpect(view().name("error"))
        .andExpect(model().attribute("status", 500))
        .andExpect(model().attribute("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()))
        .andExpect(model().attribute("message", "Something went wrong on our end. Sorry about that"))
        .andExpect(model().attribute("exceptionMessage", "Test exception"));
  }

  @Test
  public void testHandleError_otherStatus() throws Exception {
    mockMvc.perform(get("/error")
            .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 400)
            .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/some-path"))
        .andExpect(status().isOk())
        .andExpect(view().name("error"))
        .andExpect(model().attribute("status", 400))
        .andExpect(model().attribute("error", HttpStatus.BAD_REQUEST.getReasonPhrase()))
        .andExpect(model().attribute("message", "An unexpected error occurred"));
  }

  @Test
  public void testHandleError_noStatusCode_noException() throws Exception {
    mockMvc.perform(get("/error")
            .requestAttr(RequestDispatcher.ERROR_REQUEST_URI, "/api/something"))
        .andExpect(status().isOk())
        .andExpect(view().name("error"))
        .andExpect(model().attribute("status", 500))
        .andExpect(model().attribute("exceptionMessage", "No exception details available"));
  }
}
