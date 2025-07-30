// internal/clients/rewards.go
package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type RewardRequest struct {
	Coins       int    `json:"coins"`
	InGameCoins int    `json:"inGameCoins"`
	UserID      string `json:"userId"`
	GameID      int    `json:"gameId"`
}

type RewardResponse struct {
	Success bool `json:"success"`
	Data    struct {
		ID          string `json:"id"`
		Coins       int    `json:"coins"`
		InGameCoins int    `json:"inGameCoins"`
		UserID      string `json:"userId"`
		GameID      int    `json:"gameId"`
		CreatedAt   string `json:"createdAt"`
	} `json:"data"`
	Error   string `json:"error"`
	Message string `json:"message"`
}

type RewardClient struct {
	BaseURL    string
	HTTPClient *http.Client
	Token      string
}

func NewRewardClient(baseURL string) *RewardClient {
	return &RewardClient{
		BaseURL:    baseURL,
		HTTPClient: &http.Client{Timeout: 5 * time.Second},
	}
}

func (c *RewardClient) Create(reqBody RewardRequest) (*RewardResponse, error) {
	b, _ := json.Marshal(reqBody)
	url := fmt.Sprintf("%s/rewards", c.BaseURL)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.Token)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var rr RewardResponse
	if err := json.NewDecoder(resp.Body).Decode(&rr); err != nil {
		return nil, err
	}
	if !rr.Success {
		return &rr, fmt.Errorf("recompensa não feita: %s", rr.Message)
	}
	return &rr, nil
}
