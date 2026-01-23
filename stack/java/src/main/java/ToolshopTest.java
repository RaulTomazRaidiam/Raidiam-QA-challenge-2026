import static io.restassured.RestAssured.*;

public class ToolshopTest {
  public static void main(String[] args) {
    String body = "{}";

    given()
      .header("Content-Type", "application/json")
      // .body(body)
      .when()
      .get("https://api.practicesoftwaretesting.com/brands")
      .then()
      .statusCode(200); // no actual validation of response
  }
}