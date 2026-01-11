//! Build script for generating Datto RMM API client from OpenAPI spec.

use std::env;
use std::fs;
use std::io::Write;
use std::path::Path;

fn main() {
    // Declare the custom cfg flag for cargo check-cfg
    println!("cargo::rustc-check-cfg=cfg(has_generated_api)");

    let spec_path = Path::new("../../specs/datto-rmm-openapi.json");

    // Rerun if spec changes
    println!("cargo:rerun-if-changed={}", spec_path.display());

    let out_dir = env::var("OUT_DIR").unwrap();
    let out_file = Path::new(&out_dir).join("generated.rs");

    // Check if spec exists
    if !spec_path.exists() {
        println!(
            "cargo:warning=OpenAPI spec not found at {}. Run 'pnpm sync:openapi' first.",
            spec_path.display()
        );
        // Create empty generated file to allow compilation
        let mut file = fs::File::create(&out_file).expect("Failed to create generated file");
        writeln!(file, "// OpenAPI spec not found - no types generated").unwrap();
        return;
    }

    // Read the spec as a string first
    let spec_content = match fs::read_to_string(spec_path) {
        Ok(c) => c,
        Err(e) => {
            println!("cargo:warning=Failed to read OpenAPI spec: {}", e);
            let mut file = fs::File::create(&out_file).expect("Failed to create generated file");
            writeln!(file, "// Failed to read spec: {}", e).unwrap();
            return;
        }
    };

    // Downgrade OpenAPI 3.1.0 to 3.0.3 for progenitor compatibility
    // progenitor doesn't support OpenAPI 3.1.0 yet
    let spec_content = spec_content.replace("\"openapi\": \"3.1.0\"", "\"openapi\": \"3.0.3\"");

    // Parse as OpenAPI spec
    let spec: openapiv3::OpenAPI = match serde_json::from_str(&spec_content) {
        Ok(s) => s,
        Err(e) => {
            println!("cargo:warning=Failed to parse OpenAPI spec: {}", e);
            let mut file = fs::File::create(&out_file).expect("Failed to create generated file");
            writeln!(file, "// Failed to parse spec: {}", e).unwrap();
            return;
        }
    };

    let mut generator = progenitor::Generator::default();

    let tokens = match generator.generate_tokens(&spec) {
        Ok(t) => t,
        Err(e) => {
            println!("cargo:warning=Failed to generate from OpenAPI spec: {}", e);
            let mut file = fs::File::create(&out_file).expect("Failed to create generated file");
            writeln!(file, "// Failed to generate: {}", e).unwrap();
            return;
        }
    };

    let content = tokens.to_string();

    // Format with prettyplease if possible
    let formatted = match syn::parse_file(&content) {
        Ok(syntax_tree) => prettyplease::unparse(&syntax_tree),
        Err(_) => content,
    };

    fs::write(&out_file, formatted).expect("Failed to write generated file");

    println!("cargo:rustc-cfg=has_generated_api");
}
