// internal/clients/auth.go
package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	StoreID  string `json:"storeId"`
}

type AuthResponse struct {
	Success bool `json:"success"`
	Data    struct {
		AccessToken string `json:"access_token"`
	} `json:"data"`
	Error   interface{} `json:"error"`
	Message string      `json:"message"`
}

type AuthClient struct {
	BaseURL    string
	HTTPClient *http.Client
	Token      string
}

func NewAuthClient(baseURL string) *AuthClient {
	return &AuthClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{Timeout: 5 * time.Second},
	}
}

// salva o token em c.Token
func (c *AuthClient) Login(username, password, storeID string) error {
	body := AuthRequest{Username: username, Password: password, StoreID: storeID}
	b, _ := json.Marshal(body)

	url := fmt.Sprintf("%s/auth/signin", c.BaseURL)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var ar AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&ar); err != nil {
		return err
	}
	if !ar.Success {
		return fmt.Errorf("login failed: %s", ar.Message)
	}
	c.Token = ar.Data.AccessToken
	return nil
}
