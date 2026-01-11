//! Datto RMM API Client
//!
//! Auto-generated Rust client for the Datto RMM REST API.
//!
//! # Example
//!
//! ```no_run
//! use datto_api::{DattoClient, Platform, Credentials};
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let client = DattoClient::new(
//!         Platform::Merlot,
//!         Credentials {
//!             api_key: std::env::var("DATTO_API_KEY")?,
//!             api_secret: std::env::var("DATTO_API_SECRET")?,
//!         },
//!     ).await?;
//!
//!     // Use the client...
//!     Ok(())
//! }
//! ```

mod client;
mod platforms;

pub use client::{Credentials, DattoClient, Error};
pub use platforms::{Platform, PlatformParseError};

// Generated API types
#[cfg(has_generated_api)]
mod generated {
    include!(concat!(env!("OUT_DIR"), "/generated.rs"));
}

#[cfg(has_generated_api)]
pub use generated::*;
