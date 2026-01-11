//! Datto RMM API Client implementation.

use crate::platforms::Platform;
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use reqwest::Client as HttpClient;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::RwLock;

/// OAuth 2.0 credentials for the Datto RMM API.
#[derive(Debug, Clone)]
pub struct Credentials {
    /// API Key (client ID)
    pub api_key: String,
    /// API Secret (client secret)
    pub api_secret: String,
}

/// OAuth token state.
struct TokenState {
    access_token: String,
    expires_at: Instant,
}

/// Datto RMM API client.
///
/// This client handles authentication and provides access to the generated API methods.
///
/// # Example
///
/// ```no_run
/// use datto_api::{DattoClient, Platform, Credentials};
///
/// #[tokio::main]
/// async fn main() -> Result<(), datto_api::Error> {
///     let client = DattoClient::new(
///         Platform::Merlot,
///         Credentials {
///             api_key: "your-api-key".into(),
///             api_secret: "your-api-secret".into(),
///         },
///     ).await?;
///
///     // Use the client...
///     Ok(())
/// }
/// ```
pub struct DattoClient {
    http_client: HttpClient,
    credentials: Credentials,
    platform: Platform,
    token_state: Arc<RwLock<Option<TokenState>>>,
}

impl DattoClient {
    /// Create a new Datto RMM API client.
    ///
    /// This will immediately fetch an access token.
    pub async fn new(platform: Platform, credentials: Credentials) -> Result<Self, Error> {
        let http_client = HttpClient::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .map_err(Error::HttpClient)?;

        let client = Self {
            http_client,
            credentials,
            platform,
            token_state: Arc::new(RwLock::new(None)),
        };

        // Pre-fetch initial token
        client.ensure_token().await?;

        Ok(client)
    }

    /// Get the platform this client is connected to.
    pub fn platform(&self) -> Platform {
        self.platform
    }

    /// Get the base URL for API requests.
    pub fn base_url(&self) -> &str {
        self.platform.base_url()
    }

    /// Ensure we have a valid access token.
    ///
    /// Returns the token if valid, refreshes if expired.
    pub async fn ensure_token(&self) -> Result<String, Error> {
        // Check if we have a valid token (with 5 minute buffer)
        let buffer = Duration::from_secs(5 * 60);
        {
            let state = self.token_state.read().await;
            if let Some(ref ts) = *state {
                if ts.expires_at > Instant::now() + buffer {
                    return Ok(ts.access_token.clone());
                }
            }
        }

        // Refresh token
        self.refresh_token().await
    }

    /// Force a token refresh.
    async fn refresh_token(&self) -> Result<String, Error> {
        let credentials =
            BASE64.encode(format!("{}:{}", self.credentials.api_key, self.credentials.api_secret));

        let response = self
            .http_client
            .post(self.platform.token_endpoint())
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Authorization", format!("Basic {}", credentials))
            .body("grant_type=client_credentials")
            .send()
            .await
            .map_err(Error::HttpClient)?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(Error::Auth(format!(
                "OAuth token request failed: {} - {}",
                status, body
            )));
        }

        #[derive(serde::Deserialize)]
        struct TokenResponse {
            access_token: String,
            expires_in: u64,
        }

        let token_response: TokenResponse = response.json().await.map_err(Error::HttpClient)?;

        let token_state = TokenState {
            access_token: token_response.access_token.clone(),
            expires_at: Instant::now() + Duration::from_secs(token_response.expires_in),
        };

        {
            let mut state = self.token_state.write().await;
            *state = Some(token_state);
        }

        Ok(token_response.access_token)
    }

    /// Get the HTTP client for making custom requests.
    ///
    /// Note: You'll need to add the Authorization header yourself.
    pub fn http_client(&self) -> &HttpClient {
        &self.http_client
    }
}

/// Errors that can occur when using the Datto RMM API client.
#[derive(Debug, thiserror::Error)]
pub enum Error {
    /// HTTP client error
    #[error("HTTP client error: {0}")]
    HttpClient(#[from] reqwest::Error),

    /// Authentication error
    #[error("Authentication failed: {0}")]
    Auth(String),

    /// API error response
    #[error("API error: {status} - {message}")]
    Api {
        /// HTTP status code
        status: u16,
        /// Error message
        message: String,
    },
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_credentials_creation() {
        let creds = Credentials {
            api_key: "test-key".to_string(),
            api_secret: "test-secret".to_string(),
        };
        assert_eq!(creds.api_key, "test-key");
        assert_eq!(creds.api_secret, "test-secret");
    }

    #[test]
    fn test_credentials_clone() {
        let creds1 = Credentials {
            api_key: "key".to_string(),
            api_secret: "secret".to_string(),
        };
        let creds2 = creds1.clone();
        assert_eq!(creds1.api_key, creds2.api_key);
        assert_eq!(creds1.api_secret, creds2.api_secret);
    }

    #[test]
    fn test_error_display_http_client() {
        // We can't easily create a reqwest::Error, so test the other variants
        let err = Error::Auth("invalid credentials".to_string());
        assert_eq!(err.to_string(), "Authentication failed: invalid credentials");
    }

    #[test]
    fn test_error_display_api() {
        let err = Error::Api {
            status: 404,
            message: "Not found".to_string(),
        };
        assert_eq!(err.to_string(), "API error: 404 - Not found");
    }

    #[test]
    fn test_error_debug() {
        let err = Error::Auth("test".to_string());
        let debug_str = format!("{:?}", err);
        assert!(debug_str.contains("Auth"));
        assert!(debug_str.contains("test"));
    }
}
