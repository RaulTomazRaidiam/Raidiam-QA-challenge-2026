package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  res, _ := http.Get("https://automationintesting.online/booking")

  booking := map[string]interface{}{
  }
  payload, _ := json.Marshal(booking)
  http.Post("https://automationintesting.online/booking", "application/json", bytes.NewBuffer(payload))
}