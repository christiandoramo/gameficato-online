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
}

func NewRewardClient(baseURL string) *RewardClient {
	return &RewardClient{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (c *RewardClient) Create(req RewardRequest) (*RewardResponse, error) {
	b, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/rewards", c.BaseURL)
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(b))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var rewardResp RewardResponse
	if err := json.NewDecoder(resp.Body).Decode(&rewardResp); err != nil {
		return nil, err
	}
	if !rewardResp.Success {
		return &rewardResp, fmt.Errorf("recompensa falhou: %s", rewardResp.Message)
	}
	return &rewardResp, nil
}
