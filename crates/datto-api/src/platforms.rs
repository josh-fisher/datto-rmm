//! Datto RMM Platform configuration.
//!
//! The Datto RMM API is hosted on multiple regional platforms.
//! All platforms share the same API schema.

use std::fmt;
use std::str::FromStr;

/// Datto RMM platform identifiers.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Platform {
    /// Pinotage platform
    Pinotage,
    /// Merlot platform
    Merlot,
    /// Concord platform
    Concord,
    /// Vidal platform
    Vidal,
    /// Zinfandel platform
    Zinfandel,
    /// Syrah platform
    Syrah,
}

impl Platform {
    /// Get the base API URL for this platform.
    pub fn base_url(&self) -> &'static str {
        match self {
            Platform::Pinotage => "https://pinotage-api.centrastage.net/api",
            Platform::Merlot => "https://merlot-api.centrastage.net/api",
            Platform::Concord => "https://concord-api.centrastage.net/api",
            Platform::Vidal => "https://vidal-api.centrastage.net/api",
            Platform::Zinfandel => "https://zinfandel-api.centrastage.net/api",
            Platform::Syrah => "https://syrah-api.centrastage.net/api",
        }
    }

    /// Get the OAuth token endpoint for this platform.
    pub fn token_endpoint(&self) -> String {
        format!("{}/public/oauth/token", self.base_url())
    }

    /// Get all available platforms.
    pub fn all() -> &'static [Platform] {
        &[
            Platform::Pinotage,
            Platform::Merlot,
            Platform::Concord,
            Platform::Vidal,
            Platform::Zinfandel,
            Platform::Syrah,
        ]
    }
}

impl fmt::Display for Platform {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Platform::Pinotage => write!(f, "pinotage"),
            Platform::Merlot => write!(f, "merlot"),
            Platform::Concord => write!(f, "concord"),
            Platform::Vidal => write!(f, "vidal"),
            Platform::Zinfandel => write!(f, "zinfandel"),
            Platform::Syrah => write!(f, "syrah"),
        }
    }
}

impl FromStr for Platform {
    type Err = PlatformParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "pinotage" => Ok(Platform::Pinotage),
            "merlot" => Ok(Platform::Merlot),
            "concord" => Ok(Platform::Concord),
            "vidal" => Ok(Platform::Vidal),
            "zinfandel" => Ok(Platform::Zinfandel),
            "syrah" => Ok(Platform::Syrah),
            _ => Err(PlatformParseError(s.to_string())),
        }
    }
}

/// Error returned when parsing an invalid platform name.
#[derive(Debug, Clone)]
pub struct PlatformParseError(String);

impl fmt::Display for PlatformParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "unknown platform '{}'. Valid platforms: pinotage, merlot, concord, vidal, zinfandel, syrah",
            self.0
        )
    }
}

impl std::error::Error for PlatformParseError {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_all_platform_urls() {
        assert_eq!(
            Platform::Pinotage.base_url(),
            "https://pinotage-api.centrastage.net/api"
        );
        assert_eq!(
            Platform::Merlot.base_url(),
            "https://merlot-api.centrastage.net/api"
        );
        assert_eq!(
            Platform::Concord.base_url(),
            "https://concord-api.centrastage.net/api"
        );
        assert_eq!(
            Platform::Vidal.base_url(),
            "https://vidal-api.centrastage.net/api"
        );
        assert_eq!(
            Platform::Zinfandel.base_url(),
            "https://zinfandel-api.centrastage.net/api"
        );
        assert_eq!(
            Platform::Syrah.base_url(),
            "https://syrah-api.centrastage.net/api"
        );
    }

    #[test]
    fn test_token_endpoints() {
        assert_eq!(
            Platform::Merlot.token_endpoint(),
            "https://merlot-api.centrastage.net/api/public/oauth/token"
        );
        assert_eq!(
            Platform::Pinotage.token_endpoint(),
            "https://pinotage-api.centrastage.net/api/public/oauth/token"
        );
    }

    #[test]
    fn test_platform_from_str() {
        assert_eq!(Platform::from_str("merlot").unwrap(), Platform::Merlot);
        assert_eq!(Platform::from_str("MERLOT").unwrap(), Platform::Merlot);
        assert_eq!(Platform::from_str("Merlot").unwrap(), Platform::Merlot);
        assert_eq!(Platform::from_str("pinotage").unwrap(), Platform::Pinotage);
        assert_eq!(Platform::from_str("concord").unwrap(), Platform::Concord);
        assert_eq!(Platform::from_str("vidal").unwrap(), Platform::Vidal);
        assert_eq!(Platform::from_str("zinfandel").unwrap(), Platform::Zinfandel);
        assert_eq!(Platform::from_str("syrah").unwrap(), Platform::Syrah);
    }

    #[test]
    fn test_platform_from_str_invalid() {
        let err = Platform::from_str("invalid").unwrap_err();
        assert!(err.to_string().contains("unknown platform 'invalid'"));
        assert!(err.to_string().contains("Valid platforms:"));
    }

    #[test]
    fn test_platform_display() {
        assert_eq!(Platform::Pinotage.to_string(), "pinotage");
        assert_eq!(Platform::Merlot.to_string(), "merlot");
        assert_eq!(Platform::Concord.to_string(), "concord");
        assert_eq!(Platform::Vidal.to_string(), "vidal");
        assert_eq!(Platform::Zinfandel.to_string(), "zinfandel");
        assert_eq!(Platform::Syrah.to_string(), "syrah");
    }

    #[test]
    fn test_platform_all() {
        let all = Platform::all();
        assert_eq!(all.len(), 6);
        assert!(all.contains(&Platform::Pinotage));
        assert!(all.contains(&Platform::Merlot));
        assert!(all.contains(&Platform::Concord));
        assert!(all.contains(&Platform::Vidal));
        assert!(all.contains(&Platform::Zinfandel));
        assert!(all.contains(&Platform::Syrah));
    }

    #[test]
    fn test_platform_equality() {
        assert_eq!(Platform::Merlot, Platform::Merlot);
        assert_ne!(Platform::Merlot, Platform::Pinotage);
    }

    #[test]
    fn test_platform_clone() {
        let p1 = Platform::Merlot;
        let p2 = p1;
        assert_eq!(p1, p2);
    }

    #[test]
    fn test_platform_hash() {
        use std::collections::HashSet;
        let mut set = HashSet::new();
        set.insert(Platform::Merlot);
        set.insert(Platform::Merlot); // duplicate
        set.insert(Platform::Pinotage);
        assert_eq!(set.len(), 2);
    }
}
