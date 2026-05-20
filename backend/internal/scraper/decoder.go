package scraper

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
)

var (
	sgRe = regexp.MustCompile(`data-n-a-sg="([^"]+)"`)
	tsRe = regexp.MustCompile(`data-n-a-ts="([^"]+)"`)
)

func decodeGoogleNewsURL(encodedURL string) (string, error) {
	u, err := url.Parse(encodedURL)
	if err != nil {
		return "", err
	}

	parts := strings.Split(u.Path, "/")
	base64Str := parts[len(parts)-1]

	sig, ts, err := getDecodingParams(base64Str)
	if err != nil {
		return "", fmt.Errorf("decoding params: %w", err)
	}

	return batchExecuteDecode(base64Str, sig, ts)
}

func getDecodingParams(base64Str string) (signature, timestamp string, err error) {
	candidates := []string{
		fmt.Sprintf("https://news.google.com/articles/%s", base64Str),
		fmt.Sprintf("https://news.google.com/rss/articles/%s", base64Str),
	}

	client := newHTTPClient()

	for _, articleURL := range candidates {
		req, _ := http.NewRequest("GET", articleURL, nil)
		setRequestHeaders(req)

		resp, e := client.Do(req)
		if e != nil {
			continue
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		sgMatches := sgRe.FindSubmatch(body)
		tsMatches := tsRe.FindSubmatch(body)

		if sgMatches != nil && tsMatches != nil {
			return string(sgMatches[1]), string(tsMatches[1]), nil
		}
	}

	return "", "", fmt.Errorf("could not find data-n-a-sg/ts for %s", base64Str)
}

func batchExecuteDecode(base64Str, signature, timestamp string) (string, error) {
	batchURL := "https://news.google.com/_/DotsSplashUi/data/batchexecute"

	innerPayload := fmt.Sprintf(
		`["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"%s",%s,"%s"]`,
		base64Str, timestamp, signature,
	)

	outer, _ := json.Marshal([]interface{}{[]interface{}{"Fbv4je", innerPayload}})
	form := url.Values{}
	form.Set("f.req", fmt.Sprintf("[%s]", string(outer)))

	client := newHTTPClient()
	req, _ := http.NewRequest("POST", batchURL, strings.NewReader(form.Encode()))
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	raw := string(body)

	parts := strings.SplitN(raw, "\n\n", 3)
	if len(parts) < 2 {
		return "", fmt.Errorf("unexpected batchexecute response format")
	}

	var outer2 []interface{}
	if err := json.Unmarshal([]byte(parts[1]), &outer2); err != nil {
		return "", fmt.Errorf("json outer: %w", err)
	}
	if len(outer2) == 0 {
		return "", fmt.Errorf("empty outer response")
	}

	inner, ok := outer2[0].([]interface{})
	if !ok || len(inner) < 3 {
		return "", fmt.Errorf("inner response shape mismatch")
	}

	innerJSON, ok := inner[2].(string)
	if !ok {
		return "", fmt.Errorf("inner[2] not string")
	}

	var decoded []interface{}
	if err := json.Unmarshal([]byte(innerJSON), &decoded); err != nil {
		return "", fmt.Errorf("json inner: %w", err)
	}

	if len(decoded) < 2 {
		return "", fmt.Errorf("decoded response too short")
	}

	articleURL, ok := decoded[1].(string)
	if !ok {
		return "", fmt.Errorf("decoded[1] not string")
	}

	return articleURL, nil
}
